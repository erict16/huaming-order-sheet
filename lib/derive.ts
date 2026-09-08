import {
  contactFromPositions,
  defaultOctcSeries,
  defaultSelectorGrade,
  EARTH_INSULATION,
  getFamily,
} from "./catalog";
import { resolveTapFields } from "./tapCode";
import type { OrderValues, Regulation } from "./types";

function num(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function deriveValues(prev: OrderValues, patch: OrderValues): OrderValues {
  const next: OrderValues = { ...prev, ...patch };
  const fam = getFamily(next.family || "");

  if (fam && !fam.hasSelectorGrade) {
    next.oltc_selector_grade = "";
  }

  const um = num(next.oltc_um_kv || next.um_kv);
  if (um && fam?.hasSelectorGrade && !next.oltc_selector_grade) {
    next.oltc_selector_grade = defaultSelectorGrade(um);
  }
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

  if ("connection" in patch && next.connection) {
    next.octc_series = defaultOctcSeries(next.connection);
  }
  if ("octc_positions" in patch) {
    const p = num(next.octc_positions);
    if (p) next.octc_contact = contactFromPositions(p);
  }

  return next;
}
