import { resolveDeliveryDate } from "./osCells";
import { operatingDesignation } from "./positions";
import type { OrderValues } from "./types";

export const DRY_SDT_COUNT = 73;
export const DRY_CHECKBOX_COUNT = 39;

function s(v: string | undefined): string {
  return String(v ?? "").trim();
}

function n(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function kvaOf(values: OrderValues): string | undefined {
  const mva = n(values.rated_power_mva);
  if (mva == null) return undefined;
  return String(mva >= 20 ? mva * 1000 : Math.round(mva * 1000));
}

function phasesWord(values: OrderValues): string | undefined {
  if (s(values.unit_count) === "3") return "3-phase";
  const p = s(values.phases);
  if (p === "III") return "3-phase";
  if (p === "I") return "1-phase";
  if (p === "II") return "2-phase";
  return undefined;
}

function freqWord(v: string): string | undefined {
  if (v === "50") return "50Hz";
  if (v === "60") return "60Hz";
  return undefined;
}

function fluxWord(v: string): string | undefined {
  if (v === "cfvv") return "Constant";
  if (v === "vfvv") return "Variable";
  return undefined;
}

/** Official SDT 9 list: Network | Power plant | Furnace | Rectifier | Railway | Test transformer. */
function applicationWord(values: OrderValues): string | undefined {
  const app = s(values.application);
  if (app === "other") return s(values.application_other) || undefined;
  const map: Record<string, string> = {
    network: "Network",
    power: "Power plant",
    furnace: "Furnace",
    rectifier: "Rectifier",
    test: "Test transformer",
  };
  return map[app];
}

function vectorGroupWord(values: OrderValues): string | undefined {
  const vg = s(values.vector_group);
  if (vg === "other") return s(values.vector_group_other) || undefined;
  return vg || undefined;
}

function paintWord(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (!paint) return undefined;
  if (paint === "ANSI70") return "ANSI 70";
  return paint.replace("RAL", "RAL ");
}

/** Official CZ nameplate list: English / Turkish / Russian / Portuguese / Italian / French / Spanish / Romanian. */
function nameplateWord(v: string): string | undefined {
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "tr") return "Turkish";
  if (v === "pt") return "Portuguese";
  return undefined;
}

/** Official CZ docs list: English / Russian / Portuguese / French / Spanish. Schema has no fr/es keys. */
function docsLangWord(v: string): string | undefined {
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "pt") return "Portuguese";
  return undefined;
}

/** Official SDT 11 list. No wizard keys for Series / Parallel reactor. */
function txKindWord(v: string): string | undefined {
  if (v === "separated") return "Separate winding transformer";
  if (v === "auto") return "Auto-transformer";
  if (v === "booster") return "Booster transformer";
  return undefined;
}

function rangePm(raw: string): string | undefined {
  const m = raw.match(/±\s*([\d.]+)/);
  return m?.[1];
}

function rangeLeft(values: OrderValues): string | undefined {
  const minus = s(values.range_minus);
  if (minus) return `-${minus}`;
  const raw = s(values.tap_range_pct);
  const pm = rangePm(raw);
  if (pm) return `-${pm}`;
  const m = raw.match(/−\s*([\d.]+)|-\s*([\d.]+)/);
  if (m) return `-${m[1] || m[2]}`;
  const nPm = n(values.plus_minus);
  if (nPm) return `-${nPm}`;
  return undefined;
}

function rangeRight(values: OrderValues): string | undefined {
  const plus = s(values.range_plus);
  if (plus) return `+${plus}`;
  const raw = s(values.tap_range_pct);
  const pm = rangePm(raw);
  if (pm) return `+${pm}`;
  const m = raw.match(/\+\s*([\d.]+)/);
  if (m) return `+${m[1]}`;
  const nPm = n(values.plus_minus);
  if (nPm) return `+${nPm}`;
  return undefined;
}

function columnsWord(v: string): string | undefined {
  if (v === "3") return "3x";
  if (v === "1") return "1x";
  if (v === "2") return "2x";
  return undefined;
}

function designation(values: OrderValues) {
  const pos = n(values.dry_positions);
  if (!pos) return undefined;
  const reg = s(values.regulation);
  const mid: 0 | 1 | 3 = reg === "linear" || !reg ? 0 : n(values.oltc_tap_mid) === 1 ? 1 : 3;
  return operatingDesignation(pos, mid);
}

function regulatedKv(values: OrderValues): string | undefined {
  if (s(values.oltc_side) === "lv") return s(values.lv_kv) || undefined;
  return s(values.hv_kv) || undefined;
}

function remarksWord(values: OrderValues): string | undefined {
  const lines: string[] = [];
  if (s(values.transformer_type)) lines.push(s(values.transformer_type));
  if (s(values.order_no)) lines.push(s(values.order_no));
  if (s(values.destination_port)) lines.push(s(values.destination_port));
  if (s(values.overload_mode) === "above") {
    const bits = ["> IEC 60354"];
    if (s(values.overload_pct)) bits.push(`${s(values.overload_pct)}%`);
    if (s(values.overload_hours)) bits.push(`${s(values.overload_hours)} h`);
    lines.push(bits.join(" "));
  }
  const std = s(values.standard);
  if (std && std !== "IEC 60214") lines.push(std);
  const ctrl = s(values.controller);
  if (ctrl && ctrl !== "none") lines.push(ctrl);
  if (s(values.mdu_ip)) lines.push(s(values.mdu_ip));
  const lang = s(values.nameplate_language);
  if (lang && !nameplateWord(lang)) {
    const extra: Record<string, string> = { zh: "Chinese", vi: "Vietnamese", id: "Indonesian" };
    if (extra[lang]) lines.push(`Nameplate: ${extra[lang]}`);
  }
  const mv = s(values.mv_kv);
  if (mv) {
    lines.push(`MV ${mv} kV`);
    if (s(values.lv_kv)) lines.push(`LV ${s(values.lv_kv)} kV`);
  }
  const qty = s(values.quantity);
  if (qty && qty !== "1") lines.push(`Quantity: ${qty}`);
  const del = resolveDeliveryDate(values);
  if (del) lines.push(del);
  if (s(values.dry_mount) === "enclosure") lines.push("In enclosure");
  if (s(values.notes)) lines.push(s(values.notes));
  return lines.join("\n") || undefined;
}

/**
 * 39 FORMCHECKBOX on dry-order-sheet.docx, document order.
 * 0–2 ambient  3–4 altitude (no wizard key)  5–6 capacity  7–8 Ust
 * 9–17 regulation location  18–19 insulation
 * 20–30 CVT (leave off)  31–34 CZ terminals (no wizard key)
 * 35–36 MDU side  37 supporting frame std  38 frame other colour (no key)
 */
export function dryCheckValues(values: OrderValues): boolean[] {
  const on = new Array<boolean>(DRY_CHECKBOX_COUNT).fill(false);
  const tick = (i: number) => {
    on[i] = true;
  };

  const amb = s(values.ambient_band) || s(values.ambient_temp);
  if (amb.includes("-60") || amb.includes("−60")) tick(2);
  else if (amb.includes("-45") || amb.includes("−45")) tick(1);
  else if (amb.includes("-25") || amb.includes("−25")) tick(0);

  const kva = kvaOf(values);
  if (kva) {
    if (s(values.capacity_mode) === "decreasing") tick(6);
    else tick(5);
  }

  const ust = s(values.ust_mode);
  if (ust === "variable") tick(8);
  else if (ust === "constant" || s(values.step_voltage_v)) tick(7);

  const loc: Record<string, number> = {
    star_neutral: 9,
    star_middle: 10,
    star_end: 11,
    delta_end: 12,
    delta_middle: 14,
    "1plus2": 15,
    linear_end: 16,
    linear_middle: 17,
  };
  const locKey =
    s(values.tap_winding) ||
    (s(values.oltc_connection) === "D" ? "delta_end" : s(values.oltc_connection) === "Y" ? "star_neutral" : "");
  if (loc[locKey] != null) tick(loc[locKey]);

  const ins = s(values.ins_fill);
  if (ins === "provided") tick(19);
  else if (ins === "catalog") tick(18);

  const side = s(values.mdu_side);
  if (side === "right") tick(35);
  else if (side === "left") tick(36);

  if (s(values.dry_mount) === "frame") tick(37);

  return on;
}

/**
 * 73 SDTs on dry-order-sheet.docx (CZ + CVT). CZ ratings are 53–72.
 * SDT 1 is Revision "00". SDT 49 / 69 / 71 are documentation copy counts, not OLTC qty.
 * Leftover transformer SDTs: 11 Type, 20–21 range %, 22 % per step, 23 I, 24 Imax.
 * CVT block 36–52 is left blank. 63 frame colour / 67+70 2nd language have no keys.
 */
export function drySdtValues(values: OrderValues): Array<string | undefined> {
  const out: Array<string | undefined> = new Array(DRY_SDT_COUNT);
  const set = (i: number, v: string | undefined) => {
    if (v) out[i] = v;
  };

  set(0, s(values.designer_name));
  set(2, s(values.order_date));
  set(3, s(values.buyer));
  set(4, s(values.country));
  set(5, s(values.project));
  const fam = s(values.family);
  if (fam === "CZ" || fam === "CVT") set(6, fam);
  set(7, s(values.end_user));
  const mdu = s(values.mdu_model);
  if (mdu && mdu !== "none") set(8, mdu);

  set(9, applicationWord(values));
  set(10, vectorGroupWord(values));
  set(11, txKindWord(s(values.tx_kind)));
  set(12, phasesWord(values));
  set(13, freqWord(s(values.frequency_hz)));
  set(14, fluxWord(s(values.flux)));

  const kva = kvaOf(values);
  if (s(values.capacity_mode) === "decreasing") {
    set(16, kva);
    set(17, s(values.capacity_from_pos));
  } else {
    set(15, kva);
  }
  set(18, regulatedKv(values));
  set(19, s(values.dry_positions));
  set(20, rangeLeft(values));
  set(21, rangeRight(values));
  set(22, s(values.step_percent));
  set(23, s(values.through_current_a));
  set(24, s(values.imax_a));
  if (s(values.ust_mode) === "variable") {
    set(26, s(values.ust_max_v));
    set(27, s(values.ust_min_v));
  } else {
    set(25, s(values.step_voltage_v));
  }

  if (s(values.ins_fill) === "provided") {
    set(28, s(values.ins_earth_pf_kv));
    set(29, s(values.ins_earth_li_kv));
    set(30, s(values.ins_a_pf_kv));
    set(31, s(values.ins_a_li_kv));
    set(32, s(values.ins_a1_pf_kv));
    set(33, s(values.ins_a1_li_kv));
    set(34, s(values.ins_b_pf_kv));
    set(35, s(values.ins_b_li_kv));
  }

  set(53, columnsWord(s(values.unit_count)));
  set(54, s(values.oltc_current_a));
  set(55, s(values.oltc_um_kv));
  set(56, s(values.dry_positions));

  const d = designation(values);
  if (d) {
    set(57, d.max);
    set(58, d.mid);
    set(59, d.min);
  }

  set(60, s(values.drive_shaft_horizontal_mm));

  const corrosive = s(values.corrosive_class);
  if (corrosive && corrosive !== "none") set(65, corrosive);

  set(64, paintWord(values));
  const plate = nameplateWord(s(values.nameplate_language));
  set(66, plate);
  set(68, docsLangWord(s(values.nameplate_language)));
  set(72, remarksWord(values));

  return out;
}
