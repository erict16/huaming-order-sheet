import { EARTH_INSULATION } from "./catalog";
import { operatingDesignation } from "./positions";
import { typeFromValues } from "./typeString";
import type { OrderValues } from "./types";

export const HWV_FORMTEXT_COUNT = 51;
export const HWV_FORMCHECKBOX_COUNT = 68;

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

function deliveryWord(values: OrderValues): string {
  if (s(values.delivery_date) === "custom") return s(values.delivery_date_custom);
  return s(values.delivery_date);
}

function paintWord(values: OrderValues): string {
  const paint = s(values.paint);
  if (paint === "other") return s(values.paint_other);
  if (!paint) return "";
  if (paint === "ANSI70") return "ANSI 70";
  return paint.replace("RAL", "RAL ");
}

function nameplateWord(v: string): string {
  if (v === "zh") return "Chinese";
  if (v === "en") return "English";
  if (v === "ru") return "Russian";
  if (v === "vi") return "Vietnamese";
  if (v === "pt") return "Portuguese";
  if (v === "tr") return "Turkish";
  if (v === "id") return "Indonesian";
  return v;
}

function familyHead(family: string): string {
  if (family === "HWDK") return "HWDK";
  if (family === "HWV") return "HWV";
  return family;
}

function isHwdk(family: string): boolean {
  return family === "HWDK" || family.startsWith("HWDK");
}

function positionsOf(values: OrderValues): { max: string; mid: string; min: string } {
  const pos = n(values.oltc_tap_positions);
  const midRaw = n(values.oltc_tap_mid);
  const mid: 0 | 1 | 3 =
    values.regulation === "linear" ? 0 : midRaw === 1 || midRaw === 3 ? midRaw : 3;
  if (pos) {
    const d = operatingDesignation(pos, mid);
    if (d.max) return { max: d.max, mid: d.mid, min: d.min };
  }
  return { max: s(values.pos_max), mid: s(values.pos_mid), min: s(values.pos_min) };
}

function tapDiagram(values: OrderValues): string {
  return s(values.tap_code) || typeFromValues("hwv", values).compact.split("-").pop() || "";
}

/**
 * Official 2023-8 HWV/HWDK Word OS: 51 FORMTEXT + 68 FORMCHECKBOX, document order.
 */
export function hwvFormValues(values: OrderValues): {
  texts: Array<string | undefined>;
  checks: boolean[];
} {
  const texts: Array<string | undefined> = new Array(HWV_FORMTEXT_COUNT);
  const checks = new Array<boolean>(HWV_FORMCHECKBOX_COUNT).fill(false);
  const setT = (i: number, v: string | undefined) => {
    const x = s(v);
    if (x) texts[i] = x;
  };
  const on = (i: number) => {
    checks[i] = true;
  };

  const family = s(values.family);
  const phases = s(values.phases) || "III";
  const hwdk = isHwdk(family);

  setT(0, s(values.end_user) || s(values.buyer));
  setT(1, s(values.country));
  setT(2, [deliveryWord(values), s(values.destination_port)].filter(Boolean).join(" / "));
  setT(3, s(values.transformer_sn));
  setT(4, s(values.huaming_sn));
  setT(5, s(values.quantity));
  setT(6, [s(values.order_no), s(values.order_date)].filter(Boolean).join(" / "));

  if (family === "HWV" && phases === "III") on(0);
  if (family === "HWV" && phases === "I") on(1);
  if (hwdk && phases === "III") on(2);
  if (hwdk && phases === "I") on(3);

  const mdu = s(values.mdu_model);
  if (mdu === "CMA7") on(4);
  if (mdu === "SHM-D") on(5);

  const ctrl = s(values.controller);
  if (ctrl === "HMC-3C") on(6);
  if (ctrl === "ET-SZ6") on(7);
  if (ctrl === "SHM-K") on(8);

  const app = s(values.application);
  if (app === "power" || app === "network") on(9);
  else if (app === "capacity") on(10);
  else if (app === "furnace") on(11);
  else if (app === "rectifier") on(12);
  else if (app === "generator") on(13);
  else if (app === "other" || app === "test" || app === "hvdc" || app === "reactor") {
    on(14);
    setT(
      7,
      s(values.application_other) ||
        (app === "test" ? "Test transformer" : app === "hvdc" ? "HVDC" : app === "reactor" ? "Reactor" : ""),
    );
  }

  const tx = s(values.tx_kind);
  if (tx === "separated") on(15);
  else if (tx === "auto") on(16);
  else if (tx === "booster") on(17);

  if (phases === "III") on(18);
  else if (phases === "I") on(19);
  else if (s(values.phases)) {
    on(20);
    setT(8, s(values.phases_other) || phases);
  }

  const freq = s(values.frequency_hz);
  if (freq === "50") on(21);
  else if (freq === "60") on(22);
  else if (freq === "other" || (freq && freq !== "50" && freq !== "60")) {
    on(23);
    setT(9, s(values.frequency_other) || (freq === "other" ? "" : freq));
  }

  const amb = s(values.ambient_temp);
  if (!amb || amb === "-25~+40") on(24);
  else if (amb === "-40~+40") on(25);
  else if (amb === "other") {
    on(26);
    setT(10, s(values.ambient_other));
  } else {
    on(26);
    setT(10, amb);
  }

  const capMode = s(values.capacity_mode) || "constant";
  const mva = s(values.rated_power_mva);
  if (capMode === "decreasing") {
    on(28);
    setT(12, mva);
    setT(13, s(values.capacity_from_pos));
  } else if (mva) {
    on(27);
    setT(11, mva);
  }

  const ov = s(values.overload_mode);
  if (ov === "above") {
    on(30);
    setT(14, s(values.overload_pct));
    setT(15, s(values.overload_hours));
  } else if (ov === "iec") {
    on(29);
  }

  setT(16, s(values.hv_kv));

  const plusPct = s(values.range_plus) || s(values.tap_plus_pct);
  const minusPct = s(values.range_minus) || s(values.tap_minus_pct);
  const shape =
    s(values.range_shape) || (plusPct && minusPct && plusPct !== minusPct ? "asymmetric" : "symmetric");
  if (shape === "asymmetric") {
    setT(18, plusPct);
    setT(19, minusPct);
    setT(21, s(values.steps_plus));
    setT(22, s(values.steps_minus));
  } else {
    setT(17, stripPm(s(values.tap_range_pct)));
    setT(20, s(values.plus_minus));
  }

  const flux = s(values.flux);
  if (flux === "cfvv") on(31);
  else if (flux === "vfvv") on(32);
  else if (flux === "combined") on(33);

  const winding = s(values.tap_winding);
  const windingIdx: Record<string, number> = {
    star_neutral: 34,
    star_middle: 35,
    star_end: 36,
    delta_end: 37,
    delta_middle: 38,
    "1plus2": 39,
    linear_end: 40,
    linear_middle: 41,
  };
  if (winding && windingIdx[winding] != null) on(windingIdx[winding]);

  setT(23, s(values.through_current_a));
  setT(24, s(values.imax_a));
  if (hwdk) setT(25, s(values.circulating_a));

  const ustMode = s(values.ust_mode);
  if (ustMode === "variable") {
    on(43);
    setT(27, s(values.ust_max));
    setT(28, s(values.ust_min));
  } else if (s(values.step_voltage_v) || ustMode === "constant") {
    on(42);
    setT(26, s(values.step_voltage_v));
  }

  const rec = s(values.recovery_voltage_kv);
  if (rec) {
    on(44);
    setT(29, rec);
  }

  const pot = s(values.potential_connection);
  if (pot === "with") on(46);
  else if (pot === "check") on(47);
  else if (pot === "without") on(45);

  setT(30, familyHead(family));
  setT(31, phases === "other" ? s(values.phases_other) : phases);
  setT(32, s(values.oltc_current_a));
  setT(33, s(values.oltc_connection));
  setT(34, s(values.oltc_um_kv));
  setT(35, tapDiagram(values));

  if (!hwdk) {
    const pos = positionsOf(values);
    setT(36, pos.max);
    setT(37, pos.mid);
    setT(38, pos.min);
  }

  if (hwdk) {
    const basic = s(values.hwdk_basic);
    if (basic === "9_linear") {
      on(48);
      on(50);
    } else if (basic === "17") {
      on(49);
    } else if (basic === "linear") {
      on(50);
    } else if (basic === "33_reversing") {
      on(51);
      on(52);
    } else if (basic === "reversing") {
      on(52);
    } else {
      const posN = n(values.oltc_tap_positions);
      const reg = s(values.regulation);
      if (posN === 9) on(48);
      if (posN === 17) on(49);
      if (posN === 33) on(51);
      if (reg === "linear") on(50);
      if (reg === "reversing" || reg === "coarse_fine") on(52);
    }
  }

  const um = n(values.oltc_um_kv);
  const earth = um != null ? EARTH_INSULATION[um] : undefined;
  setT(39, s(values.ins_earth_pf_kv) || (earth ? String(earth.pf) : ""));
  setT(40, s(values.ins_earth_li_kv) || (earth ? String(earth.bil) : ""));
  setT(41, s(values.ins_a_pf_kv));
  setT(42, s(values.ins_a_li_kv));
  setT(43, s(values.ins_a1_pf_kv));
  setT(44, s(values.ins_a1_li_kv));
  setT(45, s(values.ins_b_pf_kv));
  setT(46, s(values.ins_b_li_kv));

  const relay = s(values.protective_relay);
  if (relay === "qj4" || relay.startsWith("QJ4-25")) on(53);
  else if (relay === "qj4g" || relay.startsWith("QJ4G-25")) on(54);
  else if (relay === "qj6" || relay.startsWith("QJ6-25")) on(55);
  else if (relay === "other") {
    on(56);
    setT(47, s(values.relay_other));
  }

  const prv = s(values.pressure_relief);
  if (prv === "rupture" || prv === "burst") on(57);
  else if (prv === "rupture_prv") on(58);
  else if (prv === "prv_no_signal") on(59);
  else if (prv === "prv_one" || prv === "prv_50") on(60);
  else if (prv === "prv_two" || prv === "prv_130") on(61);

  const paint = s(values.paint);
  if (!paint || paint === "RAL7040") on(62);
  else {
    on(63);
    setT(48, paintWord(values));
  }

  const lang = s(values.nameplate_language);
  if (!lang || lang === "en") on(64);
  else {
    on(65);
    setT(49, nameplateWord(lang));
  }

  setT(50, s(values.notes));

  const mount = s(values.oltc_mounting);
  if (mount === "weld") on(66);
  else if (mount === "bolts") on(67);

  return { texts, checks };
}
