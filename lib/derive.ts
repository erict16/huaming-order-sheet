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

  if (/^\d{4}-\d{2}-\d{2}$/.test(next.delivery_date || "") && !next.delivery_date_custom) {
    next.delivery_date_custom = next.delivery_date;
    next.delivery_date = "custom";
  }

  return next;
}
