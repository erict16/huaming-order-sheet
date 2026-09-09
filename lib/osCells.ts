import { operatingDesignation } from "./positions";
import { typeFromValues } from "./typeString";
import type { OrderValues } from "./types";

export type CellValue = string | number;
export type CellWrites = Record<string, CellValue>;

function s(v: string | undefined): string {
  return String(v ?? "").trim();
}

function n(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function set(out: CellWrites, addr: string, value: CellValue | undefined | "") {
  if (value === undefined || value === "") return;
  out[addr] = value;
}

function pipeWith(v: string): string | undefined {
  if (v === "with") return "1. With(std.)";
  if (v === "without") return "2. Without";
  return undefined;
}

function pipeBleeder(v: string, stdWithout: boolean): string | undefined {
  if (!v) return undefined;
  if (stdWithout) {
    if (v === "without") return "1. Without(std.)";
    if (v === "with") return "2. With";
  } else {
    if (v === "with") return "1. With(std.)";
    if (v === "without") return "2. Without";
  }
  return undefined;
}

function pipeGroove(v: string, stdWith: boolean): string | undefined {
  if (!v) return undefined;
  if (stdWith) {
    if (v === "with") return "1. With groove(std.)";
    if (v === "without") return "2. Without groove";
  } else {
    if (v === "without") return "1. Without groove(std.)";
    if (v === "with") return "2. With groove";
  }
  return undefined;
}

function pipeHeight(v: string): string | undefined {
  if (v === "0") return "1. No height increase(std.)";
  if (v === "100") return "2. Height increased by 100mm";
  if (v === "120") return "3. Height increased by 120mm";
  if (v === "150") return "4. Height increased by 150mm";
  return undefined;
}

function regulationOs(v: string): string | undefined {
  if (v === "reversing") return "1. Reversing";
  if (v === "linear") return "2. Linear";
  if (v === "coarse_fine") return "3. Coarse&Fine";
  return undefined;
}

function potentialOs(v: string): string | undefined {
  if (v === "without") return "1. Without";
  if (v === "with") return "2. With (Enter winding layout)";
  if (v === "check") return "3. To be checked by HM (Enter winding layout)";
  return undefined;
}

function tieInOs(v: string): string | undefined {
  if (v === "lateral") return "1. Installed laterally";
  if (v === "board") return "2. Installed separately on board";
  if (v === "cylinder") return "3. Installed below(cylinder)";
  if (v === "below_board") return "4. Installed below(board)";
  return undefined;
}

function prvOs(v: string): string | undefined {
  if (v === "burst") return "1. Rupture disc only";
  if (v === "prv_50") return "2. PRD 50mm-bore(Opening pressure 85kPa)";
  if (v === "prv_130") return "3. PRD 130mm-bore(Opening pressure 138kPa)";
  if (v === "none") return undefined;
  return undefined;
}

function flangeOs(v: string): string | undefined {
  if (v === "bell") return "1. Bell";
  if (v === "tank_top") return "2. Standard";
  return undefined;
}

function topGearOs(v: string): string | undefined {
  if (v === "right") return "Right output";
  if (v === "left") return "Left output";
  return undefined;
}

function nameplateOs(v: string): string | undefined {
  if (v === "zh") return "Chinese";
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "vi") return "English";
  if (v === "pt") return "Portugal";
  if (v === "tr") return "English";
  if (v === "id") return "English";
  return undefined;
}

function paintOs(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (!paint) return undefined;
  return paint;
}

function paintOsStd(values: OrderValues): string | undefined {
  const p = paintOs(values);
  if (!p) return undefined;
  if (s(values.paint) === "other") return p;
  return `${p}-std.`;
}

function vectorGroupOs(values: OrderValues): string | undefined {
  const vg = s(values.vector_group);
  if (vg === "other") return s(values.vector_group_other) || undefined;
  return vg || undefined;
}

function mduOs(v: string): string | undefined {
  if (v === "none") return "不配";
  if (v === "CMA7" || v === "SHM-D" || v === "SHM-DL" || v === "SHM-X") return v;
  return undefined;
}

function freqOs(v: string): string | undefined {
  if (v === "50") return "50Hz";
  if (v === "60") return "60Hz";
  return undefined;
}

function fluidOs(v: string): string | undefined {
  if (v === "mineral") return "1. Mineral oil";
  if (v === "natural_ester") return "2. Natural ester oil";
  if (v === "synthetic_ester") return "3. Synthetic ester oil";
  if (v === "silicone") return "5. Other（silicone）";
  return undefined;
}

const SHAFTS = [800, 1000, 1200, 1500, 2000] as const;

function shaftQty(mm: number | undefined): { len: number; row: number } | undefined {
  if (!mm) return undefined;
  const i = SHAFTS.indexOf(mm as (typeof SHAFTS)[number]);
  if (i >= 0) return { len: mm, row: 154 + i };
  return undefined;
}

function designationCells(values: OrderValues): { maxLine: string; midLine: string; pos: number; mid: 0 | 1 | 3 } | undefined {
  const pos = n(values.oltc_tap_positions) ?? n(values.mdu_positions);
  if (!pos) return undefined;
  const midRaw = n(values.oltc_tap_mid);
  const mid: 0 | 1 | 3 =
    values.regulation === "linear" ? 0 : midRaw === 1 || midRaw === 3 ? midRaw : 3;
  const d = operatingDesignation(pos, mid);
  if (!d.max) return undefined;
  const maxLine = `Max. effective number of turns at position ( ${d.max} )`;
  const midLine = d.mid
    ? `Mid-position(s) ( ${d.mid} )\nstop at position ( ${d.stop} )`
    : `Mid-position(s) (  )\nstop at position ( ${d.min} )`;
  return { maxLine, midLine, pos, mid };
}

/** Combine country calling code + local number as `+86 138…`. Does not double `+`. */
export function formatIntlPhone(cc: string | undefined, phone: string | undefined): string {
  const num = s(phone);
  const raw = s(cc).replace(/^\++/, "").replace(/[\s-]/g, "");
  if (!raw) return num;
  let rest = num;
  if (rest) {
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rest = rest.replace(new RegExp(`^\\+?${escaped}[\\s-]*`), "").trim();
  }
  const prefix = `+${raw}`;
  return rest ? `${prefix} ${rest}` : prefix;
}

function commonHeader(values: OrderValues, out: CellWrites) {
  set(out, "H5", s(values.designer_name));
  set(out, "H6", s(values.designer_email));
  set(out, "Z5", formatIntlPhone(values.designer_phone_cc, values.designer_phone));
  set(out, "Z3", s(values.order_date));
  set(out, "H8", s(values.buyer));
  set(out, "H9", s(values.end_user));
  set(out, "H11", s(values.country));
  set(out, "H12", n(values.quantity) ?? s(values.quantity));
  set(out, "H13", s(values.project));
  set(out, "S13", s(values.order_no));
  set(out, "H14", s(values.delivery_date));
}

function relayCells(values: OrderValues, out: CellWrites) {
  const r = s(values.protective_relay);
  if (r === "none") {
    set(out, "H134", "Without");
    set(out, "AB134", "Without");
    return;
  }
  if (r === "QJ4") {
    set(out, "H134", "one NO contact");
    set(out, "AB134", "one NO contact");
    set(out, "H133", "不配双浮球");
  } else if (r === "QJ4G") {
    set(out, "H134", "Without");
    set(out, "AB134", "one NO contact");
    set(out, "H133", "不配双浮球");
  } else if (r === "QJ6") {
    set(out, "H134", "Without");
    set(out, "AB134", "two NO contacts");
    set(out, "H133", "不配双浮球");
  }
  const groove = s(values.relay_flange_groove);
  if (groove === "with") set(out, "H138", "1. With groove");
  if (groove === "without") set(out, "H138", "2. Without groove");
}

/** Map wizard values onto In-tank OLTC Order Specification-V1.2 Sheet1. */
export function oltcCells(values: OrderValues): CellWrites {
  const out: CellWrites = {};
  commonHeader(values, out);

  const { compact } = typeFromValues("oltc", values);
  set(out, "H16", s(values.family));
  set(out, "C78", s(values.family));
  set(out, "W16", s(values.phases));
  set(out, "F78", s(values.phases));
  set(out, "AE16", mduOs(s(values.mdu_model)));

  set(out, "H18", freqOs(s(values.frequency_hz)));
  set(out, "H19", fluidOs(s(values.insulating_fluid)));
  set(out, "Z18", s(values.ambient_temp));

  const mva = n(values.rated_power_mva);
  if (mva != null) set(out, "I21", mva * 1000);

  const hv = s(values.hv_kv);
  const lv = s(values.lv_kv);
  if (hv || lv) {
    set(out, "H23", `HV(${hv || "     "}) kV\nMV(     ) kV\nLV(${lv || "     "}) kV`);
  }
  set(out, "O23", vectorGroupOs(values));

  const pm = n(values.plus_minus);
  if (pm && values.regulation !== "linear") {
    set(out, "H24", `1. ±( ${pm} ) steps`);
  }
  set(out, "Z24", s(values.tap_range_pct) ? `x  ( ${s(values.tap_range_pct)} ) %` : undefined);

  set(out, "H29", regulationOs(s(values.regulation)));
  const inA = n(values.through_current_a);
  if (inA != null) set(out, "I28", inA);
  const ust = n(values.step_voltage_v);
  if (ust != null) set(out, "I30", ust);
  set(out, "H31", s(values.recovery_voltage_kv) ? `( ${s(values.recovery_voltage_kv)} ) kV` : undefined);

  set(out, "H32", potentialOs(s(values.potential_connection)));
  if (s(values.potential_connection) === "with" || s(values.potential_connection) === "check") {
    set(out, "H33", tieInOs(s(values.tie_in_mounting)));
  }

  const cur = n(values.oltc_current_a);
  if (cur != null) set(out, "I78", cur);
  set(out, "K78", s(values.oltc_connection));
  const um = n(values.oltc_um_kv);
  if (um != null) set(out, "N78", um);
  set(out, "Q78", s(values.oltc_selector_grade));
  const pitch = n(values.oltc_tap_pitch);
  if (pitch != null) set(out, "T78", pitch);
  const pos = n(values.oltc_tap_positions);
  if (pos != null) set(out, "W78", pos);
  const mid = n(values.oltc_tap_mid);
  if (mid === 1 || mid === 3) set(out, "Z78", mid);

  set(out, "AH78", flangeOs(s(values.flange_type)));
  set(out, "H104", topGearOs(s(values.top_gear)));
  set(out, "H96", prvOs(s(values.pressure_relief)));

  const des = designationCells(values);
  if (des) {
    set(out, "H80", des.maxLine);
    set(out, "Q80", des.midLine);
    set(out, "AA80", des.midLine);
  }
  if (s(values.pos_max) && !des) {
    set(out, "H80", `Max. effective number of turns at position ( ${s(values.pos_max)} )`);
  }

  relayCells(values, out);

  set(out, "H149", pipeWith(s(values.pipe_q)));
  set(out, "O149", pipeBleeder(s(values.pipe_q_bleeder), true));
  set(out, "V149", pipeGroove(s(values.pipe_q_groove), true));
  set(out, "AC149", pipeHeight(s(values.pipe_q_height)));

  set(out, "H150", pipeWith(s(values.pipe_s)));
  set(out, "O150", pipeBleeder(s(values.pipe_s_bleeder), false));
  set(out, "V150", pipeGroove(s(values.pipe_s_groove), true));
  set(out, "AC150", pipeHeight(s(values.pipe_s_height)));

  set(out, "H151", pipeWith(s(values.pipe_r)));
  set(out, "O151", pipeBleeder(s(values.pipe_r_bleeder), true));
  set(out, "V151", pipeGroove(s(values.pipe_r_groove), false));
  set(out, "AC151", pipeHeight(s(values.pipe_r_height)));

  const e2 = s(values.pipe_e2);
  if (e2 === "without") set(out, "H152", "1. Without（std.）");
  if (e2 === "R") set(out, "H152", "2. Same as pipe R");
  if (e2 === "Q") set(out, "H152", "3. Same as pipe Q");
  if (e2 === "S") set(out, "H152", "4. Same as pipe S");

  const hShaft = shaftQty(n(values.drive_shaft_horizontal_mm));
  if (hShaft) set(out, `H${hShaft.row}`, 1);
  const vShaft = shaftQty(n(values.drive_shaft_vertical_mm));
  if (vShaft) set(out, `Z${vShaft.row}`, 1);

  set(out, "H167", paintOs(values));
  set(out, "H171", nameplateOs(s(values.nameplate_language)));
  set(out, "H169", nameplateOs(s(values.nameplate_language)));

  const notes = [s(values.notes), compact ? `Type: ${compact}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "H172", notes);

  return out;
}

function cma7Motor(values: OrderValues, out: CellWrites) {
  const mv = s(values.motor_voltage);
  const freq = s(values.frequency_hz);
  if (mv === "220_1" || mv === "110_1" || mv === "240_1") {
    set(out, "H20", "3. 单相电机_AC");
  } else if (mv) {
    set(out, "H20", "1. Three-phase motor_3ACN");
  }
  if (freq === "50") set(out, "H21", "1. frequency_50");
  if (freq === "60") set(out, "H21", "2. frequency_60");
  const volt: Record<string, number> = {
    "380_3": 380,
    "400_3": 400,
    "415_3": 415,
    "440_3": 440,
    "220_3": 220,
    "220_1": 220,
    "240_1": 240,
    "110_1": 110,
  };
  if (mv && volt[mv] != null) set(out, "H22", volt[mv]);

  if (s(values.heater) === "yes") set(out, "H38", "Continuous operation heater-std.");
  if (s(values.heater) === "no") set(out, "H38", "Without");

  const ctrl = s(values.controller);
  if (ctrl === "none") set(out, "H61", "Without");
  if (ctrl === "HMC-3C") set(out, "H61", "HMC-3C");
  if (ctrl === "SHM-KX") set(out, "H61", "SHM_KX");
  if (ctrl === "HMIET") set(out, "H61", "HMIET-I");

  const tx = s(values.position_tx);
  if (tx === "bcd") set(out, "H50", 1);
  if (tx === "4_20") set(out, "H51", "4-20mA");
  if (tx === "none") set(out, "H51", "Without-std.");
}

/** CMA7 Order Specification-V1.2 Sheet1 */
export function cma7Cells(values: OrderValues): CellWrites {
  const out: CellWrites = {};
  commonHeader(values, out);
  set(out, "H16", "CMA7");
  const des = designationCells(values);
  if (des) {
    set(out, "H17", des.maxLine);
    set(out, "P17", des.midLine);
    set(out, "Z16", des.pos);
  } else if (n(values.mdu_positions) != null) {
    set(out, "Z16", n(values.mdu_positions)!);
  }
  cma7Motor(values, out);
  set(out, "H75", paintOsStd(values));
  set(out, "H79", nameplateOs(s(values.nameplate_language)));
  const notes = [s(values.notes), s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "A83", notes || undefined);
  return out;
}

/** SHM-D Order Specification-V1.2 Sheet1 */
export function shmDCells(values: OrderValues): CellWrites {
  const out: CellWrites = {};
  commonHeader(values, out);
  set(out, "H16", s(values.shm_model) || "SHM-D");
  const des = designationCells(values);
  if (des) {
    set(out, "H17", des.maxLine);
    set(out, "P17", des.midLine);
    set(out, "Z16", des.pos);
  } else if (n(values.mdu_positions) != null) {
    set(out, "Z16", n(values.mdu_positions)!);
  }

  const mv = s(values.motor_voltage);
  if (mv === "220_240" || mv === "") {
    /* keep template AC 220-240V 50/60Hz */
  } else if (mv === "380_3") {
    set(out, "H20", "380");
  } else if (mv === "400_3") {
    set(out, "H20", "400");
  } else if (mv === "415_3") {
    set(out, "H20", "415");
  } else if (mv === "220_3" || mv === "220_1") {
    set(out, "H20", "AC 220-240V 50/60Hz");
  }

  if (s(values.heater) === "yes") set(out, "H32", "Heater with thermostat-std.");
  if (s(values.heater) === "no") set(out, "H32", "Without");

  const ctrl = s(values.controller);
  if (ctrl === "none") set(out, "H49", "Without");
  if (ctrl === "HMC-3C") set(out, "H49", "HMC-3C");
  if (ctrl === "SHM-KX") set(out, "H49", "SHM_KX");
  if (ctrl === "HMIET") set(out, "H49", "HMIET-I");

  set(out, "H61", paintOsStd(values));
  set(out, "H65", nameplateOs(s(values.nameplate_language)));
  const notes = [s(values.notes), s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "A67", notes || undefined);
  return out;
}

export function cellsForSheet(sheetId: string, values: OrderValues): CellWrites | null {
  if (sheetId === "oltc") return oltcCells(values);
  if (sheetId === "cma7") return cma7Cells(values);
  if (sheetId === "shm-d") return shmDCells(values);
  return null;
}

export const TEMPLATE_FILE: Record<"oltc" | "cma7" | "shm-d", string> = {
  oltc: "in-tank-oltc-v1.2.xlsm",
  cma7: "cma7-v1.2.xlsm",
  "shm-d": "shm-d-v1.2.xlsm",
};
