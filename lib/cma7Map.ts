import { operatingDesignation } from "./positions";
import type { OrderValues } from "./types";

function s(v: string | undefined): string {
  return String(v ?? "").trim();
}

function n(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

const MOTOR_VOLT: Record<string, number> = {
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

const CTRL_VOLT: Record<string, number> = {
  "220_ac": 220,
  "230_ac": 230,
  "240_ac": 240,
  "110_ac": 110,
  "220_dc": 220,
  "125_dc": 125,
  "110_dc": 110,
};

function motorNet(values: OrderValues): string {
  const explicit = s(values.motor_network);
  if (explicit) return explicit;
  const mv = s(values.motor_voltage);
  if (mv.endsWith("_1")) return "ac";
  if (mv.endsWith("_3") || mv) return "3acn";
  return "3acn";
}

function heaterKind(values: OrderValues): string {
  const k = s(values.heater_kind);
  if (k) return k;
  if (s(values.heater) === "no") return "without";
  if (s(values.heater) === "yes") return "resistor";
  return "resistor";
}

function paintWord(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (!paint) return undefined;
  if (paint === "ANSI70") return "ANSI 70";
  return paint.replace("RAL", "RAL ");
}

function langWord(v: string): string | undefined {
  if (v === "zh") return "Chinese";
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "vi") return "English";
  if (v === "pt") return "Portuguese";
  if (v === "tr") return "Turkish";
  return undefined;
}

function designation(values: OrderValues) {
  const pos = n(values.oltc_tap_positions) ?? n(values.mdu_positions);
  if (!pos) return undefined;
  const midRaw = n(values.oltc_tap_mid);
  const mid: 0 | 1 | 3 =
    values.regulation === "linear" ? 0 : midRaw === 1 || midRaw === 3 ? midRaw : 3;
  return operatingDesignation(pos, mid);
}

export const CMA7_CHECKBOX_COUNT = 69;

/**
 * 69 FORMCHECKBOX on cma7-order-sheet.docx, document order.
 * Word shows a tick only when w:checked/@w:val="1".
 */
export function cma7CheckValues(values: OrderValues): boolean[] {
  const on = new Array<boolean>(CMA7_CHECKBOX_COUNT).fill(false);
  const tick = (i: number) => {
    on[i] = true;
  };

  const net = motorNet(values);
  if (net === "ac") tick(1);
  else if (net === "3ac") tick(2);
  else if (net === "dc") tick(3);
  else tick(0);

  if (s(values.frequency_hz) === "60") tick(5);
  else tick(4);

  if (s(values.control_from) === "separate") tick(7);
  else tick(6);

  const cNet = s(values.control_network);
  if (cNet === "ac") tick(9);
  else if (cNet === "dc") tick(10);
  else tick(8);

  const cProt = s(values.control_protect);
  if (cProt === "1pole" || cProt === "2pole") tick(12);
  else tick(11);

  if (s(values.heat_from) === "separate") tick(14);
  else tick(13);

  if (s(values.heat_network) === "2ac") tick(16);
  else tick(15);

  const hProt = s(values.heat_protect);
  if (hProt === "1pole" || hProt === "2pole") tick(18);
  else tick(17);

  const hk = heaterKind(values);
  if (hk === "thermostat") tick(20);
  else if (hk === "hygrostat") tick(21);
  else if (hk !== "without") tick(19);

  if (s(values.hand_lamp) === "yes" || s(values.hand_lamp) === "with") tick(23);
  else tick(22);

  const endp = s(values.end_pos_sig);
  if (endp === "no") tick(25);
  else if (endp === "co") tick(26);
  else tick(24);

  const crank = s(values.crank_sig);
  if (crank === "no") tick(28);
  else if (crank === "co") tick(29);
  else tick(27);

  if (s(values.cam_s20) === "co") tick(31);
  else tick(30);

  if (s(values.incomplete_s21) === "co") tick(33);
  else tick(32);

  const sock = s(values.socket_x10);
  if (sock === "universal") tick(35);
  else if (sock === "other") tick(36);
  else tick(34);

  const noType = s(values.pos_no_type);
  if (noType === "1mbb") tick(38);
  else if (noType === "2bbm") tick(39);
  else if (noType === "2mbb") tick(40);
  else if (noType === "1bbm" || s(values.position_tx) === "potentiometer") tick(37);

  const bcd = s(values.bcd_qty) || (s(values.position_tx) === "bcd" ? "1" : "without");
  if (bcd === "1") tick(42);
  else if (bcd === "2") tick(43);
  else tick(41);

  const ma = s(values.ma_qty) || (s(values.position_tx) === "4_20" ? "1" : "without");
  if (ma === "1") tick(45);
  else if (ma === "2") tick(46);
  else if (ma === "3") tick(47);
  else tick(44);

  const rs = s(values.resistor_sig);
  if (rs === "1") tick(49);
  else if (rs === "2") tick(51);
  else if (rs === "3") tick(52);
  else tick(48);
  if (s(values.resistor_zero_first) === "yes") tick(50);

  if (s(values.door_hinge) === "right") tick(54);
  else tick(53);

  const bot = s(values.bottom_plate);
  if (bot === "gland") tick(56);
  else if (bot === "nobore") tick(57);
  else tick(55);

  if (s(values.padlock) === "yes" || s(values.padlock) === "with") tick(60);
  else tick(59);

  const avr = s(values.avr_model) || (s(values.controller) === "HMC-3C" ? "hmc3c_air" : s(values.controller) === "ET-SZ6" ? "etsz6_air" : "none");
  if (avr === "hmc3c_air") tick(62);
  else if (avr === "hmc3c_term") tick(63);
  else if (avr === "etsz6_air") {
    tick(61);
    tick(65);
  } else if (avr === "etsz6_term") {
    tick(61);
    tick(66);
  } else {
    tick(61);
    tick(64);
  }

  const cable = n(values.avr_cable_m);
  if (cable && cable !== 30) tick(68);
  else tick(67);

  return on;
}

/** 32 SDTs on cma7-order-sheet.docx. */
export function cma7SdtValues(values: OrderValues): Array<string | undefined> {
  const out: Array<string | undefined> = new Array(32);
  const set = (i: number, v: string | undefined) => {
    if (v) out[i] = v;
  };

  set(0, s(values.designer_name));
  set(2, s(values.order_date));
  set(3, s(values.buyer));
  set(4, [s(values.end_user), s(values.country)].filter(Boolean).join(", "));
  set(5, s(values.project));
  set(6, s(values.drawing_no));

  const d = designation(values);
  if (d) {
    set(7, d.max);
    set(8, d.mid);
    set(9, d.min);
  }
  set(10, s(values.auto_passage));

  const mv = MOTOR_VOLT[s(values.motor_voltage)];
  if (mv != null) set(11, String(mv));
  const cv = CTRL_VOLT[s(values.control_voltage)];
  if (cv != null) set(12, String(cv));
  const cProt = s(values.control_protect);
  if (cProt === "1pole") set(13, "1-pole auto-cut");
  if (cProt === "2pole") set(13, "2-pole auto-cut");
  const hv = CTRL_VOLT[s(values.heat_voltage)] ?? (s(values.heat_from) !== "separate" ? cv : undefined);
  if (hv != null) set(14, String(hv));
  const hProt = s(values.heat_protect);
  if (hProt === "1pole") set(15, "1-pole auto-cut");
  if (hProt === "2pole") set(15, "2-pole auto-cut");
  set(16, s(values.socket_country));
  set(17, s(values.resistor_ohm));
  set(18, s(values.resistor_ohm_2));
  set(19, s(values.resistor_ohm_3));
  set(21, paintWord(values));
  set(22, s(values.corrosive_class));
  set(23, langWord(s(values.nameplate_language)));
  set(25, langWord(s(values.nameplate_language)));
  set(26, s(values.quantity) || "1");
  const remarks = [s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : "", s(values.notes)]
    .filter(Boolean)
    .join("\n");
  set(29, remarks);
  const cable = n(values.avr_cable_m);
  if (cable && cable !== 30) set(30, String(cable));
  return out;
}
