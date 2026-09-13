import { operatingDesignation } from "./positions";
import { formatIntlPhone, resolveDeliveryDate } from "./osCells";
import type { OrderValues } from "./types";

export const OCTC_FORMTEXT_COUNT = 64;
export const OCTC_FORMCHECKBOX_COUNT = 69;

function s(v: string | undefined): string {
  return String(v ?? "").trim();
}

function n(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

function stripPm(v: string): string {
  return v.replace(/^[±+\-\s]+/, "").trim();
}

function paintWord(values: OrderValues): string {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other);
  if (!paint) return "";
  return paint.replace("RAL", "RAL ");
}

function phasesDigit(phases: string): string {
  if (phases === "III") return "3";
  if (phases === "II") return "2";
  if (phases === "I") return "1";
  return phases;
}

function isCage(family: string): boolean {
  return family === "WSL" || family === "WDL";
}

function isDrum(family: string): boolean {
  return family === "WDG" || family === "WLG" || family === "WSG";
}

function isWslD(family: string): boolean {
  return family === "WSL-D" || family === "WSLD";
}

function contactToken(values: OrderValues): string {
  const contact = s(values.octc_contact);
  const size = s(values.octc_size);
  if (contact) return `${contact}${size}`;
  return s(values.octc_positions);
}

function octcPositions(values: OrderValues): { max: string; mid: string; min: string } {
  if (s(values.pos_max) || s(values.pos_mid) || s(values.pos_min)) {
    return { max: s(values.pos_max), mid: s(values.pos_mid), min: s(values.pos_min) };
  }
  const pos = n(values.octc_positions);
  if (pos) {
    const d = operatingDesignation(pos, 1);
    if (d.max) return { max: d.max, mid: d.mid, min: d.min };
  }
  return { max: "", mid: "", min: "" };
}

/**
 * Official 2011-7-25 OCTC Word OS (textutil FORMTEXT/FORMCHECKBOX), document order.
 *
 * FORMTEXT T00–T63 (64):
 *   T00 designer name  T01 tel  T02 email  T03 fax
 *   T04 purchaser  T05 transformer user  T06 country  T07 delivery/port
 *   T08 transformer SN  T09 Huaming SN  T10 quantity  T11 PO/date
 *   T12 application others  T13 phases others  T14 freq others Hz  T15 ambient others ℃
 *   T16 overload >IEC %  T17 overload hours
 *   T18 capacity MVA constant  T19 decreasing MVA  T20 decreasing from position
 *   T21 rated voltage kV
 *   T22 range ± %  T23 range + %  T24 range − %
 *   T25 steps ±  T26 steps +  T27 steps −
 *   T28 I A  T29 Imax A
 *   T30 constant Ust V  T31 variable Ust max  T32 variable Ust min
 *   T33–T40 insulation PF/BIL (ground, phases, across winding, adjacent)
 *   T41–T47 type table: Type, phases, connection, Ium, Y/D, Um, Positions
 *   T48 WSL/WDL contact diameter mm
 *   T49 max position  T50 mid  T51 min
 *   T52 WSL cable m  T53 WSL-D cable m  T54 WDG cable m
 *   T55–T58 H1–H4  T59–T61 V1–V3
 *   T62 paint others  T63 special application / remarks
 *
 * FORMCHECKBOX C00–C68 (69):
 *   C00 Power  C01 Capacity  C02 Furnace  C03 Rectifier  C04 Generator  C05 Others
 *   C06 Separated  C07 Auto  C08 Booster
 *   C09 3-ph  C10 1-ph  C11 Phases others
 *   C12 50Hz  C13 60Hz  C14 Freq others
 *   C15 Amb -25+40  C16 -40+40  C17 Amb others
 *   C18 Overload IEC  C19 Overload >
 *   C20 Capacity constant  C21 decreasing
 *   C22 Ust constant  C23 Ust variable
 *   C24 Linear IV  C25 Reversing II  C26 Single-bridging V
 *   C27 Double-bridging VII  C28 Serial-parallel VIII  C29 Y-D VI
 *   C30–C37 tap winding config
 *   C38 Standard flange  C39 Bell
 *   C40 WSL  C41 WDL  C42 WSL-D  C43 WDG  C44 WLG  C45 WSG
 *   C46 size A  C47 size B
 *   C48 lead A  C49 lead B  C50 lead C
 *   C51 Hand wheel  C52 HMC-3W
 *   C53 Manual drive box  C54 HMC-3W
 *   C55 CMA9  C56 HMC-3W
 *   C57 WSL-D motor top
 *   C58 Top manual  C59 HMC-3W
 *   C60 Side manual top trans  C61 HMC-3W
 *   C62 Side manual bottom  C63 HMC-3W
 *   C64 CMA7  C65 HMC-3W
 *   C66 protective cover
 *   C67 Paint RAL7040  C68 Paint others
 */
export function octcFormValues(values: OrderValues): {
  texts: Array<string | undefined>;
  checks: boolean[];
} {
  const texts: Array<string | undefined> = new Array(OCTC_FORMTEXT_COUNT);
  const checks = new Array<boolean>(OCTC_FORMCHECKBOX_COUNT).fill(false);
  const setT = (i: number, v: string | undefined) => {
    const x = s(v);
    if (x) texts[i] = x;
  };
  const on = (i: number) => {
    checks[i] = true;
  };

  const family = s(values.family);
  const phases = s(values.phases) || "III";
  const series = s(values.octc_series);
  const drive = s(values.octc_drive) || "handwheel";
  const remarks: string[] = [];

  setT(0, s(values.designer_name));
  if (s(values.designer_phone)) {
    const cc = s(values.designer_phone_cc) === "other" ? s(values.designer_phone_cc_other) : s(values.designer_phone_cc);
    setT(1, formatIntlPhone(cc, values.designer_phone));
  }
  setT(2, s(values.designer_email));
  setT(3, s(values.designer_fax));

  setT(4, s(values.buyer));
  setT(5, s(values.end_user) || s(values.project));
  setT(6, s(values.country));
  setT(7, [resolveDeliveryDate(values), s(values.destination_port)].filter(Boolean).join(" / "));
  setT(8, s(values.transformer_sn));
  setT(9, s(values.huaming_sn));
  setT(10, s(values.quantity));
  setT(11, [s(values.order_no), s(values.order_date)].filter(Boolean).join(" / "));

  const app = s(values.application);
  if (app === "power") on(0);
  else if (app === "capacity") on(1);
  else if (app === "furnace") on(2);
  else if (app === "rectifier") on(3);
  else if (app === "generator") on(4);
  else if (app) {
    on(5);
    setT(12, app === "other" ? s(values.application_other) : app);
  }

  const tx = s(values.tx_kind);
  if (tx === "separated") on(6);
  else if (tx === "auto") on(7);
  else if (tx === "booster") on(8);

  if (phases === "III") on(9);
  else if (phases === "I") on(10);
  else if (phases) {
    on(11);
    setT(13, s(values.phases_other) || phases);
  }

  const freq = s(values.frequency_hz);
  if (freq === "50") on(12);
  else if (freq === "60") on(13);
  else if (freq) {
    on(14);
    setT(14, s(values.frequency_other) || (freq === "other" ? "" : freq));
  }

  const amb = s(values.ambient_temp);
  if (amb === "-25~+40" || /−?\s*25\s*[~～]\s*\+?\s*40/.test(amb)) on(15);
  else if (amb === "-40~+40" || /−?\s*40\s*[~～]\s*\+?\s*40/.test(amb)) on(16);
  else if (amb) {
    on(17);
    setT(15, s(values.ambient_other) || amb);
  }

  const ov = s(values.overload_mode);
  if (ov === "above") {
    on(19);
    setT(16, s(values.overload_pct));
    setT(17, s(values.overload_hours));
  } else if (ov === "iec") {
    on(18);
  }

  const capMode = s(values.capacity_mode) || "constant";
  const mva = s(values.rated_power_mva);
  if (capMode === "decreasing") {
    on(21);
    setT(19, mva);
    setT(20, s(values.capacity_from_pos));
  } else if (mva) {
    on(20);
    setT(18, mva);
  }

  setT(21, s(values.hv_kv));

  const shape = s(values.range_shape);
  if (shape === "asymmetric") {
    setT(23, s(values.tap_plus_pct));
    setT(24, s(values.tap_minus_pct));
    setT(26, s(values.steps_plus));
    setT(27, s(values.steps_minus));
  } else {
    setT(22, stripPm(s(values.tap_range_pct)));
    setT(25, s(values.plus_minus));
  }

  setT(28, s(values.through_current_a) || s(values.i_a));
  setT(29, s(values.imax_a));

  const ustMode = s(values.ust_mode);
  if (ustMode === "variable") {
    on(23);
    setT(31, s(values.ust_max));
    setT(32, s(values.ust_min));
  } else if (s(values.step_voltage_v) || ustMode === "constant") {
    on(22);
    setT(30, s(values.step_voltage_v));
  }

  if (series === "IV") on(24);
  else if (series === "II") on(25);
  else if (series === "V") on(26);
  else if (series === "VII") on(27);
  else if (series === "VIII") on(28);
  else if (series === "VI") on(29);

  const winding = s(values.tap_winding);
  const windingIdx: Record<string, number> = {
    star_neutral: 30,
    star_middle: 31,
    star_end: 32,
    delta_end: 33,
    delta_middle: 34,
    "1plus2": 35,
    linear_end: 36,
    linear_middle: 37,
  };
  if (winding && windingIdx[winding] != null) on(windingIdx[winding]);

  const flange = s(values.flange_type);
  if (flange === "tank_top" || flange === "standard") on(38);
  else if (flange === "bell") on(39);

  // T33–T40 insulation left blank: OCTC wizard has no PF/BIL fields, and
  // derive() would otherwise stamp catalog Um earth (72.5 → 140/350). Line-end
  // D OS (MEE WSLII-600D) use 80/190.

  setT(41, family);
  setT(42, phases === "other" ? s(values.phases_other) : phasesDigit(phases));
  setT(43, series);
  setT(44, s(values.current_a));
  setT(45, s(values.connection));
  setT(46, s(values.um_kv));
  setT(47, contactToken(values));

  if (family === "WSL") on(40);
  else if (family === "WDL") on(41);
  else if (isWslD(family)) on(42);
  else if (family === "WDG") on(43);
  else if (family === "WLG") on(44);
  else if (family === "WSG") on(45);

  setT(48, s(values.octc_contact_diameter_mm) || s(values.contact_diameter_mm));

  const size = s(values.octc_size);
  if (size === "A") on(46);
  else if (size === "B") on(47);

  const lead = s(values.octc_lead) || s(values.lead_output);
  if (lead === "A") on(48);
  else if (lead === "B") on(49);
  else if (lead === "C") on(50);

  const pos = octcPositions(values);
  setT(49, pos.max);
  setT(50, pos.mid);
  setT(51, pos.min);

  setT(52, s(values.wsl_cable_m) || s(values.cable_length_m));
  setT(53, s(values.wsld_cable_m));
  setT(54, s(values.wdg_cable_m));

  if (isCage(family)) {
    if (drive === "handwheel") on(51);
    else if (drive === "CMA7") remarks.push("CMA7 motor drive unit");
    else if (drive === "SHM-D") remarks.push("SHM-D motor drive unit");
  } else if (isWslD(family)) {
    if (drive === "CMA7" || drive === "SHM-D") on(57);
    setT(53, s(values.wsld_cable_m) || s(values.cable_length_m));
  } else if (isDrum(family)) {
    if (drive === "handwheel") on(58);
    else if (drive === "CMA7") on(64);
    else if (drive === "SHM-D") remarks.push("SHM-D motor drive unit");
  } else if (drive === "handwheel") {
    on(51);
  } else if (drive === "CMA7") {
    on(64);
  }

  setT(55, s(values.h1) || s(values.drive_shaft_horizontal_mm));
  setT(56, s(values.h2));
  setT(57, s(values.h3));
  setT(58, s(values.h4));
  setT(59, s(values.v1) || s(values.drive_shaft_vertical_mm));
  setT(60, s(values.v2));
  setT(61, s(values.v3));

  const cover = s(values.rain_cover) || s(values.protective_cover);
  if (cover === "yes" || cover === "true") on(66);

  const paint = s(values.paint);
  if (paint === "RAL7040") on(67);
  else if (paint) {
    on(68);
    setT(62, paintWord(values));
  }

  const note = s(values.notes);
  if (note) remarks.push(note);
  setT(63, remarks.join("\n"));

  return { texts, checks };
}
