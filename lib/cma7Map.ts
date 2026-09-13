import { resolveDeliveryDate } from "./osCells";
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

const MOTOR_VOLT: Record<string, string> = {
  "380_3": "380",
  "400_3": "400",
  "415_3": "415",
  "440_3": "440",
  "220_3": "220",
  "220_240": "220-240",
  "220_1": "220",
  "230_1": "230",
  "240_1": "240",
  "110_1": "110",
};

const CTRL_VOLT: Record<string, string> = {
  "220_ac": "220",
  "230_ac": "230",
  "240_ac": "240",
  "110_ac": "110",
  "220_dc": "220",
  "125_dc": "125",
  "110_dc": "110",
};

/** Official SDT 13 / 15 lists. Schema has no with-signal key. */
function protectWord(v: string): string | undefined {
  if (v === "1pole") return "1-pole, auto-cut, without signal";
  if (v === "2pole") return "2-pole, auto-cut, without signal";
  return undefined;
}

function motorVoltText(values: OrderValues): string | undefined {
  return MOTOR_VOLT[s(values.motor_voltage)];
}

function ctrlVoltText(values: OrderValues): string | undefined {
  const cv = s(values.control_voltage);
  if (cv === "same") return motorVoltText(values);
  return CTRL_VOLT[cv];
}

function motorNet(values: OrderValues): string {
  const explicit = s(values.motor_network);
  if (explicit) return explicit;
  const mv = s(values.motor_voltage);
  if (!mv) return "";
  if (mv.endsWith("_1")) return "ac";
  return "3acn";
}

function heaterKind(values: OrderValues): string {
  const k = s(values.heater_kind);
  if (k) return k;
  if (s(values.heater) === "no") return "without";
  if (s(values.heater) === "yes") return "resistor";
  return "";
}

function avrChoice(values: OrderValues): string {
  const avr = s(values.avr_model);
  if (avr) return avr;
  const c = s(values.controller);
  if (c === "HMC-3C") return "hmc3c_air";
  if (c === "ET-SZ6") return "etsz6_air";
  return "";
}

function paintWord(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (!paint) return undefined;
  if (paint === "ANSI70") return "ANSI 70";
  return paint.replace("RAL", "RAL ");
}

/** Official nameplate / docs lists have no Chinese / Vietnamese / Indonesian. */
function plateLang(v: string): string | undefined {
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "tr") return "Turkish";
  if (v === "pt") return "Portuguese";
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

function remarksWord(values: OrderValues): string | undefined {
  const lines: string[] = [];
  if (s(values.matching_oltc)) lines.push(`OLTC: ${s(values.matching_oltc)}`);
  const qty = s(values.quantity);
  if (qty && qty !== "1") lines.push(`Quantity: ${qty}`);
  const del = resolveDeliveryDate(values);
  if (del) lines.push(del);
  if (s(values.destination_port)) lines.push(s(values.destination_port));
  if (s(values.order_no)) lines.push(s(values.order_no));
  const ip = s(values.mdu_ip);
  if (ip && ip !== "IP54") lines.push(ip);
  if (s(values.parallel) === "yes") lines.push("Parallel operation");
  const side = s(values.mdu_side);
  if (side === "right") lines.push("MDU on the right");
  else if (side === "left") lines.push("MDU on the left");
  const lang = s(values.nameplate_language);
  if (lang && !plateLang(lang)) {
    const extra: Record<string, string> = { zh: "Chinese", vi: "Vietnamese", id: "Indonesian" };
    if (extra[lang]) lines.push(`Nameplate: ${extra[lang]}`);
  }
  if (s(values.notes)) lines.push(s(values.notes));
  return lines.join("\n") || undefined;
}

export const CMA7_CHECKBOX_COUNT = 69;
export const CMA7_SDT_COUNT = 32;

/**
 * 69 FORMCHECKBOX on cma7-order-sheet.docx, document order.
 * Tick only from wizard keys. Printed standard-included block has no boxes
 * (motor N/C, over-current jumper, in-operation N/O, Remote/Off/Local, Phoenix UK5).
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
  else if (net === "3acn") tick(0);

  if (s(values.frequency_hz) === "60") tick(5);
  else if (s(values.frequency_hz) === "50") tick(4);

  if (s(values.control_from) === "separate") tick(7);
  else if (s(values.control_from) === "motor") tick(6);

  const cNet = s(values.control_network);
  if (cNet === "ac") tick(9);
  else if (cNet === "dc") tick(10);
  else if (cNet === "2ac") tick(8);

  const cProt = s(values.control_protect);
  if (cProt === "1pole" || cProt === "2pole") tick(12);
  else if (cProt === "without") tick(11);

  if (s(values.heat_from) === "separate") tick(14);
  else if (s(values.heat_from) === "motor") tick(13);

  if (s(values.heat_network) === "2ac") tick(16);
  else if (s(values.heat_network) === "ac") tick(15);

  const hProt = s(values.heat_protect);
  if (hProt === "1pole" || hProt === "2pole") tick(18);
  else if (hProt === "without") tick(17);

  const hk = heaterKind(values);
  if (hk === "thermostat") tick(20);
  else if (hk === "hygrostat") tick(21);
  else if (hk === "resistor") tick(19);

  if (s(values.hand_lamp) === "yes" || s(values.hand_lamp) === "with") tick(23);
  else if (s(values.hand_lamp) === "no" || s(values.hand_lamp) === "without") tick(22);

  const endp = s(values.end_pos_sig);
  if (endp === "no") tick(25);
  else if (endp === "co") tick(26);
  else if (endp === "without") tick(24);

  const crank = s(values.crank_sig);
  if (crank === "no") tick(28);
  else if (crank === "co") tick(29);
  else if (crank === "without") tick(27);

  if (s(values.cam_s20) === "co") tick(31);
  else if (s(values.cam_s20) === "without") tick(30);

  if (s(values.incomplete_s21) === "co") tick(33);
  else if (s(values.incomplete_s21) === "without") tick(32);

  const sock = s(values.socket_x10);
  if (sock === "universal") tick(35);
  else if (sock === "other") tick(36);
  else if (sock === "without") tick(34);

  const noType = s(values.pos_no_type);
  if (noType === "1mbb") tick(38);
  else if (noType === "2bbm") tick(39);
  else if (noType === "2mbb") tick(40);
  else if (noType === "1bbm" || s(values.position_tx) === "potentiometer") tick(37);

  const bcd = s(values.bcd_qty) || (s(values.position_tx) === "bcd" ? "1" : "");
  if (bcd === "1") tick(42);
  else if (bcd === "2") tick(43);
  else if (bcd === "without") tick(41);

  const ma = s(values.ma_qty) || (s(values.position_tx) === "4_20" ? "1" : "");
  if (ma === "1") tick(45);
  else if (ma === "2") tick(46);
  else if (ma === "3") tick(47);
  else if (ma === "without") tick(44);

  const rs = s(values.resistor_sig);
  if (rs === "1") tick(49);
  else if (rs === "2") tick(51);
  else if (rs === "3") tick(52);
  else if (rs === "without") tick(48);
  if (s(values.resistor_zero_first) === "yes") tick(50);

  if (s(values.door_hinge) === "right") tick(54);
  else if (s(values.door_hinge) === "left") tick(53);

  const bot = s(values.bottom_plate);
  if (bot === "gland") tick(56);
  else if (bot === "nobore") tick(57);
  else if (bot === "other") tick(58);
  else if (bot === "holes50") tick(55);

  if (s(values.padlock) === "yes" || s(values.padlock) === "with") tick(60);
  else if (s(values.padlock) === "no" || s(values.padlock) === "without") tick(59);

  const avr = avrChoice(values);
  if (avr === "hmc3c_air") tick(62);
  else if (avr === "hmc3c_term") tick(63);
  else if (avr === "none" || avr === "etsz6_air" || avr === "etsz6_term") tick(61);
  if (avr === "etsz6_air") tick(65);
  else if (avr === "etsz6_term") tick(66);
  else if (avr === "none" || avr === "hmc3c_air" || avr === "hmc3c_term") tick(64);
  const aviation = avr === "hmc3c_air" || avr === "etsz6_air";
  if (aviation) {
    const cable = n(values.avr_cable_m);
    if (cable && cable !== 30) tick(68);
    else if (cable === 30) tick(67);
  }

  return on;
}

/**
 * 32 SDTs on cma7-order-sheet.docx.
 * 1 is Revision. 24 / 27 / 28 are 2nd language / qty with no wizard keys.
 * 26 is documentation copy count, not order quantity.
 */
export function cma7SdtValues(values: OrderValues): Array<string | undefined> {
  const out: Array<string | undefined> = new Array(CMA7_SDT_COUNT);
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
  set(7, s(values.pos_max) || d?.max);
  set(8, s(values.pos_mid) || d?.mid);
  set(9, s(values.pos_min) || d?.min);
  set(10, s(values.auto_passage));

  set(11, motorVoltText(values));
  const cv = ctrlVoltText(values);
  set(12, cv);
  set(13, protectWord(s(values.control_protect)));
  const hv = CTRL_VOLT[s(values.heat_voltage)] ?? (s(values.heat_from) === "motor" ? cv : undefined);
  set(14, hv);
  set(15, protectWord(s(values.heat_protect)));
  set(16, s(values.socket_country));
  set(17, s(values.resistor_ohm));
  set(18, s(values.resistor_ohm_2));
  set(19, s(values.resistor_ohm_3));
  if (s(values.bottom_plate) === "other") set(20, s(values.bottom_plate_other));
  set(21, paintWord(values));
  const cor = s(values.corrosive_class);
  if (cor && cor !== "none") set(22, cor);
  const plate = plateLang(s(values.nameplate_language));
  set(23, plate);
  set(25, plate);
  set(29, remarksWord(values));
  const cable = n(values.avr_cable_m);
  if (cable && cable !== 30) set(30, String(cable));
  return out;
}
