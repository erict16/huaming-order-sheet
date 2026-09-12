import { operatingDesignation } from "./positions";
import { typeFromValues } from "./typeString";
import type { OrderValues } from "./types";

function s(v: string | undefined): string {
  return String(v ?? "").trim();
}

function n(v: string | undefined): number | undefined {
  if (v == null || v === "") return undefined;
  const x = Number(v);
  return Number.isFinite(x) ? x : undefined;
}

const FAMILY_HEAD: Record<string, string> = {
  CV: "CV(350A)",
  SV: "SV(500A)",
  CM: "CM",
  CV2: "CV2(Vacuum)",
  CM2: "CM2(Vacuum)",
  CMD: "CMD",
  SHZV: "SHZV(Vacuum）",
  SHZVG: "SHZVG(Vacuum)",
};

const FAMILY_ROW: Record<string, string> = {
  CV: "CV",
  SV: "SV",
  CM: "CM",
  CV2: "CV2",
  CM2: "CM2",
  CMD: "CMD",
  SHZV: "SHZV",
  SHZVG: "SHZVG",
};

function phasesWord(v: string): string | undefined {
  if (v === "III") return "3-phase";
  if (v === "I") return "1-phase";
  if (v === "II") return "2-phase";
  return undefined;
}

function freqWord(v: string): string | undefined {
  if (v === "50") return "50Hz";
  if (v === "60") return "60Hz";
  return undefined;
}

function tieInWord(values: OrderValues): string | undefined {
  const p = s(values.potential_connection);
  if (p === "without") return "Without";
  if (p === "check") return "To be checked by HM";
  const m = s(values.tie_in_mounting);
  if (m === "lateral") return "Laterally installed (only for CV,SV,CV2)";
  if (m === "board") return "Installed separately on board";
  if (m === "cylinder" || m === "below_board") return "Installed below ";
  if (p === "with") return "Installed separately on board";
  return undefined;
}

function paintWord(values: OrderValues): string | undefined {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other) || undefined;
  if (!paint) return undefined;
  if (paint === "ANSI70") return "ANSI 70";
  return paint.replace("RAL", "RAL ");
}

function applicationWord(values: OrderValues): string | undefined {
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
  return map[app] || app || undefined;
}

function vectorGroupWord(values: OrderValues): string | undefined {
  const vg = s(values.vector_group);
  if (vg === "other") return s(values.vector_group_other) || undefined;
  return vg || undefined;
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

function txKindWord(v: string): string | undefined {
  if (v === "separated") return "Separate winding transformer";
  if (v === "auto") return "Auto-transformer";
  if (v === "booster") return "Booster transformer";
  return undefined;
}

function fluxWord(v: string): string | undefined {
  if (v === "cfvv") return "Constant";
  if (v === "vfvv") return "Variable";
  if (v === "combined") return "Combined";
  return undefined;
}

function kvaOf(values: OrderValues): string | undefined {
  const mva = n(values.rated_power_mva);
  if (mva == null) return undefined;
  return String(mva >= 20 ? mva * 1000 : Math.round(mva * 1000));
}

function rangeLeft(values: OrderValues): string | undefined {
  const minus = s(values.range_minus);
  if (minus) return `-${minus}`;
  const raw = s(values.tap_range_pct);
  const m = raw.match(/−\s*([\d.]+)|-\s*([\d.]+)/);
  if (m) return `-${m[1] || m[2]}`;
  const pm = n(values.plus_minus);
  if (pm) return `-${pm}`;
  return undefined;
}

function rangeRight(values: OrderValues): string | undefined {
  const plus = s(values.range_plus);
  if (plus) return `+${plus}`;
  const raw = s(values.tap_range_pct);
  const m = raw.match(/\+\s*([\d.]+)/);
  if (m) return `+${m[1]}`;
  const pm = n(values.plus_minus);
  if (pm) return `+${pm}`;
  return undefined;
}

const OLTC_CHECKBOX_COUNT = 40;

/**
 * Legacy FORMCHECKBOX order in oltc-order-sheet.docx (40 boxes).
 * Word shows a tick only when `w:checked/@w:val="1"`.
 */
export function oltcCheckValues(values: OrderValues): boolean[] {
  const on = new Array<boolean>(OLTC_CHECKBOX_COUNT).fill(false);
  const tick = (i: number) => {
    on[i] = true;
  };

  const overload = s(values.overload_mode) || "iec";
  if (overload === "above") tick(1);
  else tick(0);

  const amb = s(values.ambient_band) || s(values.ambient_temp);
  if (amb.includes("-60") || amb.includes("−60")) tick(4);
  else if (amb.includes("-45") || amb.includes("−45")) tick(3);
  else tick(2);

  if (s(values.capacity_mode) === "decreasing") tick(6);
  else tick(5);

  if (s(values.ust_mode) === "variable") tick(8);
  else tick(7);

  const loc: Record<string, number> = {
    star_neutral: 9,
    star_middle: 10,
    star_end: 11,
    delta_end: 12,
    special: 13,
    delta_middle: 14,
    "1plus2": 15,
    linear_end: 16,
    linear_middle: 17,
  };
  const locKey = s(values.tap_winding) || (s(values.oltc_connection) === "D" ? "delta_end" : "star_neutral");
  if (loc[locKey] != null) tick(loc[locKey]);

  const ins = s(values.ins_fill);
  if (ins === "provided") tick(19);
  else tick(18);

  if (s(values.special_winding) === "yes") tick(20);

  const support = s(values.support_flange);
  if (support === "with") tick(22);
  else if (support === "special") tick(23);
  else if (s(values.flange_type) === "bell" || support === "without") tick(21);

  const fam = s(values.family);
  const amp = n(values.oltc_current_a) ?? 0;
  if (fam === "CMD" || fam === "SHZV" || fam === "SHZVG") {
    tick(28);
    if (amp > 600) tick(31);
    else tick(29);
  } else if (fam === "CM" || fam === "CM2") {
    tick(24);
    tick(25);
  } else if (fam === "CV" || fam === "SV" || fam === "CV2") {
    tick(24);
  }

  if (s(values.pressure_relief) === "none" || s(values.pressure_relief) === "burst" || !s(values.pressure_relief)) {
    tick(33);
  } else {
    tick(34);
  }

  if (s(values.temp_sensor) === "with") tick(36);
  else tick(35);

  tick(38);
  return on;
}

/** Content-control values in document order for OLTC order sheet.docx (96 SDTs). */
export function oltcSdtValues(values: OrderValues): Array<string | undefined> {
  const out: Array<string | undefined> = new Array(96);
  const set = (i: number, v: string | undefined) => {
    if (v) out[i] = v;
  };

  set(0, s(values.designer_name));
  // SDT 1 is Revision "00" ("Choose a number"), not the quotation / doc number.
  set(2, s(values.order_date));
  set(3, s(values.buyer));
  set(4, s(values.country));
  set(5, s(values.project));
  set(6, FAMILY_HEAD[s(values.family)]);
  set(7, s(values.end_user));
  set(8, s(values.mdu_model) === "none" ? undefined : s(values.mdu_model));
  set(9, applicationWord(values));
  set(10, vectorGroupWord(values));
  set(11, txKindWord(s(values.tx_kind)));
  set(12, phasesWord(s(values.phases)));
  set(13, freqWord(s(values.frequency_hz)));
  set(14, fluxWord(s(values.flux)));
  const kva = kvaOf(values);
  if (s(values.capacity_mode) === "decreasing") {
    set(17, kva);
    set(18, s(values.capacity_from_pos));
  } else {
    set(16, kva);
  }
  set(19, s(values.hv_kv));
  set(20, s(values.oltc_on_kv) || s(values.hv_kv));
  const steps = n(values.oltc_tap_positions);
  if (steps) set(21, String(steps));
  set(22, rangeLeft(values));
  set(23, rangeRight(values));
  set(24, s(values.step_percent));
  const thru = n(values.through_current_a) ?? n(values.oltc_current_a);
  if (thru != null) set(25, String(thru));
  const imax = n(values.imax_a);
  if (imax != null) set(26, String(imax));
  if (s(values.ust_mode) === "variable") {
    set(28, s(values.ust_max_v));
    set(29, s(values.ust_min_v));
  } else {
    set(27, s(values.step_voltage_v));
  }
  set(30, s(values.ins_earth_pf_kv));
  set(31, s(values.ins_earth_li_kv));
  set(32, s(values.ins_a_pf_kv));
  set(33, s(values.ins_a_li_kv));
  set(34, s(values.ins_a1_pf_kv));
  set(35, s(values.ins_a1_li_kv));
  set(36, s(values.ins_b_pf_kv));
  set(37, s(values.ins_b_li_kv));
  set(38, s(values.ins_c1_pf_kv));
  set(39, s(values.ins_c1_li_kv));
  set(40, s(values.ins_c2_pf_kv));
  set(41, s(values.ins_c2_li_kv));
  set(42, s(values.ins_d_pf_kv));
  set(43, s(values.ins_d_li_kv));
  set(44, s(values.wind_r1_mm));
  set(45, s(values.wind_r2_mm));
  set(46, s(values.wind_r3_mm));
  set(47, s(values.wind_r4_mm));
  set(48, s(values.wind_h1_mm));
  set(49, s(values.wind_h2_mm));
  set(50, s(values.wind_cw_pf));
  set(51, s(values.wind_ca_pf));
  set(52, s(values.recovery_voltage_kv));
  {
    const mv = s(values.mv_kv);
    if (mv) {
      set(
        53,
        [
          `MV ${mv} kV`,
          s(values.lv_kv) ? `LV ${s(values.lv_kv)} kV` : "",
          s(values.notes),
        ]
          .filter(Boolean)
          .join("\n"),
      );
    }
  }

  if (s(values.phases) === "I") set(54, "1x");
  else if (s(values.phases)) set(54, "3x");
  set(55, FAMILY_ROW[s(values.family)]);
  set(56, s(values.phases));
  set(57, s(values.oltc_current_a));
  set(58, s(values.oltc_connection));
  set(59, s(values.oltc_um_kv));
  set(60, s(values.oltc_selector_grade));
  set(61, s(values.tap_code) || typeFromValues("oltc", values).compact);
  set(62, tieInWord(values));

  const d = designation(values);
  if (d) {
    set(63, d.max);
    set(64, d.mid);
    set(65, d.min);
  } else {
    set(63, s(values.pos_max));
    set(64, s(values.pos_mid));
    set(65, s(values.pos_min));
  }

  set(66, s(values.pipe_q));
  set(67, s(values.pipe_q_height));
  set(68, s(values.pipe_s));
  set(69, s(values.pipe_s_height));
  set(70, s(values.pipe_r));
  set(71, s(values.pipe_r_height));
  set(72, s(values.pipe_e2));
  set(73, s(values.pipe_e2_height));
  set(74, s(values.protective_relay));

  if (s(values.pressure_relief) === "prv_50" || s(values.pressure_relief) === "prv_130") {
    set(76, "YSF series，one C/O alarm contact");
  } else if (s(values.pressure_relief) === "burst") {
    set(76, "flange without valve ");
  }

  const h1 = s(values.h1) || s(values.drive_shaft_horizontal_mm);
  const v1 = s(values.v1) || s(values.drive_shaft_vertical_mm);
  if (h1) set(78, h1);
  if (s(values.h2)) set(79, s(values.h2));
  if (s(values.h3)) set(80, s(values.h3));
  if (s(values.h4)) set(81, s(values.h4));
  if (v1) set(82, v1);
  if (s(values.v2)) set(83, s(values.v2));
  if (s(values.v3)) set(84, s(values.v3));
  if (s(values.v4)) set(85, s(values.v4));

  set(87, paintWord(values));
  set(88, s(values.corrosive_class));
  set(89, langWord(s(values.nameplate_language)));
  set(91, langWord(s(values.nameplate_language)));
  set(92, s(values.quantity));
  if (s(values.temp_sensor) === "with") set(77, s(values.temp_sensor_type) || "PT100");
  if (!out[53]) set(95, s(values.notes));

  return out;
}

export { cma7CheckValues, cma7SdtValues } from "./cma7Map";

export const WORD_TEMPLATE: Record<string, { file: string; mime: string }> = {
  oltc: {
    file: "oltc-order-sheet.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  cma7: {
    file: "cma7-order-sheet.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  "shm-d": {
    file: "shm-d-order-sheet.doc",
    mime: "application/msword",
  },
  dry: {
    file: "dry-order-sheet.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  hwv: {
    file: "hwv-hwdk-order-spec.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  octc: {
    file: "octc-order-spec.docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
};
