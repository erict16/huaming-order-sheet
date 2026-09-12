import {
  contactFromPositions,
  currentsFor,
  defaultOctcSeries,
  defaultSelectorGrade,
  EARTH_INSULATION,
  getFamily,
} from "./catalog";
import { operatingDesignation } from "./positions";
import { resolveTapFields } from "./tapCode";
import type { OrderValues, Regulation } from "./types";

const GRADE_RANK: Record<string, number> = { B: 1, C: 2, D: 3, DE: 4 };

function num(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function ensureGrade(next: OrderValues, um: number | undefined) {
  const fam = getFamily(next.family || "");
  if (!fam?.hasSelectorGrade) {
    next.oltc_selector_grade = "";
    return;
  }
  if (!um) return;
  const floor = defaultSelectorGrade(um);
  const cur = next.oltc_selector_grade;
  const curRank = GRADE_RANK[cur] ?? 0;
  const floorRank = GRADE_RANK[floor] ?? 0;
  if (!cur || curRank < floorRank) {
    next.oltc_selector_grade = floor;
  }
}

function fillPositions(next: OrderValues) {
  const positions = num(next.oltc_tap_positions);
  if (!positions) return;
  const midRaw = num(next.oltc_tap_mid);
  const mid: 0 | 1 | 3 =
    next.regulation === "linear" ? 0 : midRaw === 1 || midRaw === 3 ? midRaw : 3;
  const d = operatingDesignation(positions, mid);
  if (!d.max) return;
  next.pos_max = d.max;
  next.pos_mid = d.mid;
  next.pos_min = d.min;
}

export function deriveValues(prev: OrderValues, patch: OrderValues): OrderValues {
  const next: OrderValues = { ...prev, ...patch };
  const fam = getFamily(next.family || "");

  if ("family" in patch && next.family === "HWDK" && (prev.mdu_model === "CMA7" || !prev.mdu_model)) {
    next.mdu_model = "SHM-X";
  }
  if ("family" in patch && next.family === "HWV" && prev.mdu_model === "SHM-X") {
    next.mdu_model = "CMA7";
  }

  if ("family" in patch || "phases" in patch) {
    const amps = currentsFor(fam, next.phases || "III");
    const cur = num(next.oltc_current_a);
    if (cur != null && amps.length && !amps.includes(cur)) next.oltc_current_a = "";
    const octcCur = num(next.current_a);
    if (octcCur != null && amps.length && !amps.includes(octcCur)) next.current_a = "";
    if (fam?.umKv?.length) {
      const umNow = num(next.oltc_um_kv || next.um_kv);
      if (umNow != null && !fam.umKv.includes(umNow)) {
        next.oltc_um_kv = "";
        next.um_kv = "";
      }
    }
  }

  if (fam && !fam.hasSelectorGrade) {
    next.oltc_selector_grade = "";
  }

  const um = num(next.oltc_um_kv || next.um_kv);
  ensureGrade(next, um);

  if (um && EARTH_INSULATION[um] && (patch.oltc_um_kv || patch.um_kv)) {
    next.ins_earth_pf_kv = String(EARTH_INSULATION[um].pf);
    next.ins_earth_li_kv = String(EARTH_INSULATION[um].bil);
  }

  const regulation = next.regulation as Regulation;
  const plusMinus = num(next.plus_minus);
  const positions = num(next.oltc_tap_positions);
  const tapTouched =
    "regulation" in patch ||
    "plus_minus" in patch ||
    "oltc_tap_mid" in patch ||
    "oltc_tap_positions" in patch ||
    "oltc_tap_pitch" in patch;

  if (
    (regulation === "linear" || regulation === "reversing" || regulation === "coarse_fine") &&
    (plusMinus || positions) &&
    (tapTouched || !next.tap_code)
  ) {
    const pitch = num(next.oltc_tap_pitch);
    const midRaw = num(next.oltc_tap_mid);
    const mid = midRaw === 1 || midRaw === 3 ? midRaw : undefined;
    const resolved = resolveTapFields({
      regulation,
      plusMinusSteps: plusMinus,
      positions,
      pitch,
      midPositions: mid,
    });
    next.oltc_tap_positions = String(resolved.positions);
    next.oltc_tap_pitch = String(resolved.pitch);
    next.oltc_tap_mid = String(resolved.mid);
    next.tap_code = resolved.tapCode;
  }

  if (tapTouched || "family" in patch || !next.pos_max) {
    fillPositions(next);
  }

  if ("connection" in patch && next.connection) {
    next.octc_series = defaultOctcSeries(next.connection);
  }
  if ("octc_positions" in patch) {
    const p = num(next.octc_positions);
    if (p) next.octc_contact = contactFromPositions(p);
  }

  const leadPhrases = ["90 days after PO", "120 days after PO", "150 days after PO", "180 days after PO", "TBC"];
  if (leadPhrases.includes(next.delivery_date || "")) {
    next.delivery_lead = next.delivery_date;
    next.delivery_date = "";
  }
  if (next.delivery_date === "custom" && next.delivery_date_custom) {
    next.delivery_date = next.delivery_date_custom;
  } else if ("delivery_date_custom" in patch) {
    const custom = String(next.delivery_date_custom ?? "").trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(custom) && (!next.delivery_date || next.delivery_date === "custom")) {
      next.delivery_date = custom;
    }
  }

  if ("range_plus" in patch || "range_minus" in patch) {
    const plus = num(next.range_plus);
    const minus = num(next.range_minus);
    if (plus != null && minus != null) {
      next.tap_range_pct = plus === minus ? `±${plus}%` : `−${minus}/+${plus}%`;
      if (plus !== minus) next.range_shape = "asymmetric";
    }
  } else if (
    next.range_shape !== "asymmetric" &&
    ("plus_minus" in patch || "step_percent" in patch || "regulation" in patch)
  ) {
    const nSteps = num(next.plus_minus);
    const pct = String(next.step_percent ?? "").trim();
    if (nSteps != null && pct) next.tap_range_pct = `±${nSteps}×${pct}%`;
    else if (nSteps != null) next.tap_range_pct = `±${nSteps}%`;
  }

  if ("oltc_side" in patch || "hv_kv" in patch || "lv_kv" in patch || "mv_kv" in patch) {
    const side = next.oltc_side || "hv";
    if (side === "lv") next.oltc_on_kv = next.lv_kv || "";
    else if (side === "mv") next.oltc_on_kv = next.mv_kv || "";
    else next.oltc_on_kv = next.hv_kv || "";
  }

  if ("ambient_min" in patch || "ambient_max" in patch) {
    const min = num(next.ambient_min);
    const max = num(next.ambient_max);
    if (min != null && max != null) {
      const lo = Math.abs(min);
      const hi = Math.abs(max);
      next.ambient_temp = `−${lo}～+${hi} ℃`;
      next.ambient_other = next.ambient_temp;
    }
  }

  return next;
}
