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

/** Wizard stores official Word pipe strings, not with/without. */
function parsePipe(v: string): { present?: string; bleeder?: string; groove?: string } {
  const t = v.toLowerCase();
  if (!t) return {};
  if (t === "with" || t === "without") return { present: t };
  if (t.includes("blind")) return { present: "without" };
  const bleeder = t.includes("without bleeder") ? "without" : t.includes("with bleeder") ? "with" : undefined;
  const groove = t.includes("without groove") ? "without" : t.includes("with groove") ? "with" : undefined;
  return { present: "with", bleeder, groove };
}

function writePipeRow(
  out: CellWrites,
  spec: string,
  bleederKey: string,
  grooveKey: string,
  heightKey: string,
  addrs: { present: string; bleeder: string; groove: string; height: string },
  std: { bleederWithout: boolean; grooveWith: boolean },
) {
  const p = parsePipe(spec);
  set(out, addrs.present, pipeWith(p.present || spec));
  set(out, addrs.bleeder, pipeBleeder(bleederKey || p.bleeder || "", std.bleederWithout));
  set(out, addrs.groove, pipeGroove(grooveKey || p.groove || "", std.grooveWith));
  set(out, addrs.height, pipeHeight(heightKey));
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
  if (paint === "ANSI70") return "ANSI 70";
  if (!paint) return undefined;
  return paint;
}

/** CMA7/SHM-D ku list: only RAL7040 carries -std. */
function paintOsStd(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (paint === "ANSI70") return "ANSI 70";
  if (paint === "RAL7040") return "RAL7040-std.";
  if (!paint) return undefined;
  return paint;
}

function corrosiveOsStd(v: string): string | undefined {
  if (!v || v === "none") return undefined;
  if (v === "C5-M") return "C5-M-std.";
  return v;
}

function quantityValue(values: OrderValues): CellValue | undefined {
  const q = n(values.quantity);
  if (q != null) return q;
  const t = s(values.quantity);
  return t || undefined;
}

function separateVolt(v: string): string | undefined {
  const map: Record<string, string> = {
    "120_ac": "120V AC",
    "220_ac": "220V AC",
    "230_ac": "230V AC",
    "240_ac": "240V AC",
    "110_ac": "110V AC",
    "48_dc": "48V DC",
    "110_dc": "110V DC",
    "125_dc": "125V DC",
    "220_dc": "220V DC",
  };
  return map[v];
}

function resistorOhm(v: string): string | undefined {
  const t = s(v);
  if (!t) return undefined;
  if (/[Ωω]|ohm/i.test(t)) return t;
  return `${t}Ω`;
}

function cma7Controller(v: string): string | undefined {
  if (!v) return undefined;
  if (v === "none") return "Without";
  if (v.startsWith("hmc3c") || v === "HMC-3C") return "HMC-3C(Terminal Type)";
  if (v.startsWith("etsz6") || v === "ET-SZ6") return "Without";
  if (v === "SHM-KX") return "SHM-KX/ZB";
  if (v === "HMIET") return "HMIET-I(Standard Version)";
  return undefined;
}

function minPosLine(v: string): string {
  return `Min. effective number of turns at position ( ${v} )`;
}

function applicationOs(values: OrderValues): string | undefined {
  const app = s(values.application);
  if (app === "other") return s(values.application_other) || undefined;
  const map: Record<string, string> = {
    network: "Network",
    power: "Power",
    generator: "Generator",
    capacity: "Capacity regulation",
    furnace: "Furnace",
    rectifier: "Rectifier",
    hvdc: "HVDC",
    reactor: "Reactor",
    test: "Test transformer",
  };
  return map[app];
}

function txKindOs(v: string): string | undefined {
  if (v === "separated") return "1. Separate winding transformer";
  if (v === "auto") return "2. Auto transformer";
  if (v === "booster") return "3. Booster transformer";
  return undefined;
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

function designationCells(
  values: OrderValues,
): { maxLine: string; midLine: string; minLine: string; pos: number; mid: 0 | 1 | 3 } | undefined {
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
  return { maxLine, midLine, minLine: minPosLine(d.min), pos, mid };
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

/** ISO dates and custom calendar dates, else the commercial lead-time string. */
export function resolveDeliveryDate(values: OrderValues): string {
  const d = s(values.delivery_date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  if (d === "custom") return s(values.delivery_date_custom);
  const lead = s(values.delivery_lead);
  if (lead) return lead;
  return d;
}

function resolvedPhoneCc(values: OrderValues): string {
  return s(values.designer_phone_cc) === "other" ? s(values.designer_phone_cc_other) : s(values.designer_phone_cc);
}

export function formatDesignerPhone(values: OrderValues): string {
  return formatIntlPhone(resolvedPhoneCc(values), values.designer_phone);
}

function commonHeader(values: OrderValues, out: CellWrites) {
  set(out, "H5", s(values.designer_name));
  set(out, "H6", s(values.designer_email));
  set(out, "Z5", formatDesignerPhone(values));
  set(out, "Z3", s(values.order_date));
  set(out, "H8", s(values.buyer));
  set(out, "H9", s(values.end_user));
  set(out, "H11", s(values.country));
  set(out, "H12", quantityValue(values));
  set(out, "H13", s(values.project));
  set(out, "S13", s(values.order_no));
  set(out, "H14", resolveDeliveryDate(values));
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
  set(out, "Z12", applicationOs(values));
  set(out, "W16", s(values.phases));
  set(out, "F78", s(values.phases));
  set(out, "AE16", mduOs(s(values.mdu_model)));

  set(out, "H17", txKindOs(s(values.tx_kind)));
  set(out, "H18", freqOs(s(values.frequency_hz)));
  set(out, "H19", fluidOs(s(values.insulating_fluid)));
  set(out, "Z18", s(values.ambient_temp));

  const mva = n(values.rated_power_mva);
  if (mva != null) set(out, "I21", mva * 1000);

  const hv = s(values.hv_kv);
  const mv = s(values.mv_kv);
  const lv = s(values.lv_kv);
  if (hv || mv || lv) {
    set(out, "H23", `HV(${hv || "     "}) kV\nMV(${mv || "     "}) kV\nLV(${lv || "     "}) kV`);
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
  const imax = n(values.imax_a);
  if (imax != null) set(out, "Z28", imax);
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

  writePipeRow(
    out,
    s(values.pipe_q),
    s(values.pipe_q_bleeder),
    s(values.pipe_q_groove),
    s(values.pipe_q_height),
    { present: "H149", bleeder: "O149", groove: "V149", height: "AC149" },
    { bleederWithout: true, grooveWith: true },
  );
  writePipeRow(
    out,
    s(values.pipe_s),
    s(values.pipe_s_bleeder),
    s(values.pipe_s_groove),
    s(values.pipe_s_height),
    { present: "H150", bleeder: "O150", groove: "V150", height: "AC150" },
    { bleederWithout: false, grooveWith: true },
  );
  writePipeRow(
    out,
    s(values.pipe_r),
    s(values.pipe_r_bleeder),
    s(values.pipe_r_groove),
    s(values.pipe_r_height),
    { present: "H151", bleeder: "O151", groove: "V151", height: "AC151" },
    { bleederWithout: true, grooveWith: false },
  );

  const e2 = s(values.pipe_e2);
  if (e2 === "without" || /blind/i.test(e2)) set(out, "H152", "1. Without（std.）");
  else if (e2 === "R" || (e2 && e2 === s(values.pipe_r))) set(out, "H152", "2. Same as pipe R");
  else if (e2 === "Q" || (e2 && e2 === s(values.pipe_q))) set(out, "H152", "3. Same as pipe Q");
  else if (e2 === "S" || (e2 && e2 === s(values.pipe_s))) set(out, "H152", "4. Same as pipe S");

  const hShaft = shaftQty(n(values.drive_shaft_horizontal_mm));
  if (hShaft) set(out, `H${hShaft.row}`, 1);
  const vShaft = shaftQty(n(values.drive_shaft_vertical_mm));
  if (vShaft) set(out, `Z${vShaft.row}`, 1);

  set(out, "H167", paintOs(values));
  const corrosive = s(values.corrosive_class);
  if (corrosive && corrosive !== "none") set(out, "H168", corrosive);
  set(out, "H171", nameplateOs(s(values.nameplate_language)));
  set(out, "H169", nameplateOs(s(values.nameplate_language)));
  set(out, "H170", quantityValue(values));

  const notes = [s(values.notes), compact ? `Type: ${compact}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "A173", notes);

  return out;
}

function cma7Motor(values: OrderValues, out: CellWrites) {
  const mv = s(values.motor_voltage);
  const freq = s(values.frequency_hz);
  const net = s(values.motor_network);
  if (net === "3ac") set(out, "H20", "2. Three-phase motor_3AC");
  else if (net === "ac" || mv.endsWith("_1")) set(out, "H20", "3. Single-phase motor_AC");
  else if (net === "dc") set(out, "H20", "4. DC motor_DC");
  else if (mv) set(out, "H20", "1. Three-phase motor_3ACN");
  if (freq === "50") set(out, "H21", "1. frequency_50");
  if (freq === "60") set(out, "H21", "2. frequency_60");
  const volt: Record<string, number> = {
    "380_3": 380,
    "400_3": 400,
    "415_3": 415,
    "440_3": 440,
    "220_3": 220,
    "220_1": 220,
    "230_1": 230,
    "240_1": 240,
    "110_1": 110,
  };
  if (mv && volt[mv] != null) set(out, "H22", volt[mv]);

  if (s(values.control_from) === "separate") {
    set(out, "H25", "2. Separate from motor circuit");
    set(out, "H26", separateVolt(s(values.control_voltage)));
  } else if (s(values.control_from) === "motor" || mv) {
    set(out, "H25", "1. Supply from motor circuit-std.");
  }
  const cProt = s(values.control_protect);
  if (cProt === "1pole") set(out, "H27", "2. 1-pole miniature circuit breaker");
  else if (cProt === "2pole") set(out, "H27", "3. 2-pole miniature circuit breaker");
  else if (cProt === "without") set(out, "H27", "1. Without-std.");

  if (s(values.heat_from) === "separate") {
    set(out, "H34", "2. Separate from motor circuit");
    set(out, "H35", separateVolt(s(values.heat_voltage)));
  } else if (s(values.heat_from) === "motor") {
    set(out, "H34", "1. Supply from motor circuit-std.");
  }
  const hProt = s(values.heat_protect);
  if (hProt === "1pole") set(out, "H36", "2. 1-pole miniature circuit breaker");
  else if (hProt === "2pole") set(out, "H36", "3. 2-pole miniature circuit breaker");
  else if (hProt === "without") set(out, "H36", "1. Without-std.");

  const hk = s(values.heater_kind) || (s(values.heater) === "no" ? "without" : s(values.heater) === "yes" ? "resistor" : "");
  if (hk === "thermostat") set(out, "H38", "Heater with thermostat");
  else if (hk === "hygrostat") set(out, "H38", "Heater with Temperature and Humidity controller");
  else if (hk === "without") set(out, "H38", "Without");
  else if (hk === "resistor") set(out, "H38", "Continuous operation heater-std.");

  if (s(values.hand_lamp) === "no") set(out, "H40", "Without");
  else if (s(values.hand_lamp) === "yes") set(out, "H40", "With-std.");

  const sig = (v: string) => (v === "no" ? "1 N/O" : v === "co" ? "1 C/O" : v === "without" ? "Without-std." : "");
  const endp = sig(s(values.end_pos_sig));
  if (endp) set(out, "H41", endp);
  const crank = sig(s(values.crank_sig));
  if (crank) set(out, "H42", crank);
  if (s(values.cam_s20) === "co") set(out, "H43", "1 C/O");
  else if (s(values.cam_s20) === "without") set(out, "H43", "Without-std.");
  if (s(values.incomplete_s21) === "co") set(out, "H44", "1 C/O");
  else if (s(values.incomplete_s21) === "without") set(out, "H44", "Without-std.");

  if (s(values.socket_x10) === "without") set(out, "H47", "1. Without-std.");
  else if (s(values.socket_x10) === "universal" || s(values.socket_x10) === "other") {
    set(out, "H47", "2. With（include residual current circuit breaker ）");
    const spec = s(values.socket_x10) === "universal" ? "Universal" : s(values.socket_country);
    set(out, "H48", spec);
  }

  const noType = s(values.pos_no_type);
  if (noType === "1bbm" || noType === "2bbm") {
    set(out, "H52", "2. With");
    set(out, "H53", noType === "2bbm" ? 2 : 1);
  } else if (noType === "1mbb" || noType === "2mbb") {
    set(out, "H52", "2. With");
    set(out, "H54", noType === "2mbb" ? 2 : 1);
  } else if (noType === "without") {
    set(out, "H52", "1. Without-std.");
  }

  const bcd = s(values.bcd_qty) || (s(values.position_tx) === "bcd" ? "1" : "");
  if (bcd === "without") set(out, "H50", "Without-std.");
  else if (bcd === "1" || bcd === "2" || bcd === "3") set(out, "H50", Number(bcd));
  const ma = s(values.ma_qty) || (s(values.position_tx) === "4_20" ? "1" : "");
  if (ma === "without") set(out, "H51", "Without-std.");
  else if (ma === "1" || ma === "2" || ma === "3") set(out, "H51", Number(ma));

  const rs = s(values.resistor_sig);
  if (rs === "without") set(out, "H55", "1. Without-std.");
  else if (rs === "1" || rs === "2" || rs === "3") {
    set(out, "H55", "2. With(same resistance)");
    set(out, "H56", resistorOhm(s(values.resistor_ohm)));
    set(out, "V56", Number(rs));
    if (s(values.resistor_zero_first) === "yes") set(out, "H57", "0Ω");
  }

  const avr = s(values.avr_model) || s(values.controller);
  set(out, "H61", cma7Controller(avr));

  if (s(values.door_hinge) === "right") set(out, "H69", "Right-hand");
  else if (s(values.door_hinge) === "left") set(out, "H69", "Left-hand");
  if (s(values.bottom_plate) === "nobore") set(out, "H70", "Dummy plate");
  else if (s(values.bottom_plate) === "holes50" || s(values.bottom_plate) === "gland") set(out, "H70", "2xΦ50 hole-std.");
  if (s(values.padlock) === "yes" || s(values.padlock) === "with") set(out, "H73", "With");
  else if (s(values.padlock) === "no" || s(values.padlock) === "without") set(out, "H73", "Without-std.");
}

/** CMA7 Order Specification-V1.2 Sheet1 */
export function cma7Cells(values: OrderValues): CellWrites {
  const out: CellWrites = {};
  commonHeader(values, out);
  set(out, "H16", "CMA7");
  const des = designationCells(values);
  if (s(values.pos_max)) {
    set(out, "H17", `Max. effective number of turns at position ( ${s(values.pos_max)} )`);
  } else if (des) {
    set(out, "H17", des.maxLine);
  }
  if (s(values.pos_mid)) {
    set(out, "P17", `Mid-position(s) ( ${s(values.pos_mid)} )`);
  } else if (des) {
    set(out, "P17", des.midLine);
  }
  if (s(values.pos_min)) set(out, "AB17", minPosLine(s(values.pos_min)));
  else if (des) set(out, "AB17", des.minLine);
  if (n(values.mdu_positions) != null) set(out, "Z16", n(values.mdu_positions)!);
  else if (des) set(out, "Z16", des.pos);
  cma7Motor(values, out);
  set(out, "H75", paintOsStd(values));
  set(out, "H76", corrosiveOsStd(s(values.corrosive_class)));
  set(out, "H78", quantityValue(values));
  set(out, "H79", nameplateOs(s(values.nameplate_language)));
  const notes = [s(values.notes), s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "D83", notes || undefined);
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
    set(out, "AB17", des.minLine);
    set(out, "Z16", des.pos);
  } else if (n(values.mdu_positions) != null) {
    set(out, "Z16", n(values.mdu_positions)!);
  }
  if (s(values.pos_min) && !des) set(out, "AB17", minPosLine(s(values.pos_min)));

  const mv = s(values.motor_voltage);
  if (mv === "220_240" || mv === "") {
    /* keep template AC 220-240V 50/60Hz */
  } else if (mv === "380_3") {
    set(out, "H20", "380");
  } else if (mv === "400_3") {
    set(out, "H20", "400");
  } else if (mv === "415_3") {
    set(out, "H20", "415");
  } else if (mv === "220_3" || mv === "220_1" || mv === "230_1" || mv === "240_1") {
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
  set(out, "H64", quantityValue(values));
  set(out, "H65", nameplateOs(s(values.nameplate_language)));
  const notes = [s(values.notes), s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : ""]
    .filter(Boolean)
    .join("\n");
  set(out, "E67", notes || undefined);
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
  cma7: "cma7-order-specification-v1.2.xlsm",
  "shm-d": "shm-d-order-specification-v1.2.xlsm",
};

export function excelTemplateFor(sheetId: string): string | undefined {
  if (sheetId === "oltc" || sheetId === "cma7" || sheetId === "shm-d") {
    return TEMPLATE_FILE[sheetId];
  }
  return undefined;
}
