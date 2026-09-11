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
  set(12, phasesWord(s(values.phases)));
  set(13, freqWord(s(values.frequency_hz)));
  const mva = n(values.rated_power_mva);
  if (mva != null) set(16, String(mva * 1000));
  set(19, s(values.hv_kv));
  const pm = n(values.plus_minus);
  if (pm) set(21, String(pm));
  set(22, s(values.tap_range_pct));
  const thru = n(values.through_current_a) ?? n(values.oltc_current_a);
  if (thru != null) set(25, String(thru));
  const ust = n(values.step_voltage_v);
  if (ust != null) set(27, String(ust));
  set(52, s(values.recovery_voltage_kv));
  set(53, s(values.notes));

  set(54, s(values.phases) === "I" ? "1x" : "3x");
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

  const h = s(values.drive_shaft_horizontal_mm);
  const v = s(values.drive_shaft_vertical_mm);
  if (h) set(78, h);
  if (v) set(82, v);

  set(87, paintWord(values));
  set(89, langWord(s(values.nameplate_language)));
  set(91, langWord(s(values.nameplate_language)));
  set(92, s(values.quantity) || "1");
  if (!out[53]) set(95, s(values.notes));

  return out;
}

/** CMA7 order sheet.docx — 32 SDTs. */
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
  const d = designation(values);
  if (d) {
    set(7, d.max);
    set(8, d.mid);
    set(9, d.min);
  }
  set(21, paintWord(values));
  set(23, langWord(s(values.nameplate_language)));
  set(25, langWord(s(values.nameplate_language)));
  set(26, s(values.quantity) || "1");
  const remarks = [s(values.matching_oltc) ? `OLTC: ${s(values.matching_oltc)}` : "", s(values.notes)]
    .filter(Boolean)
    .join("\n");
  set(29, remarks);
  return out;
}

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
