import { getFamily } from "./catalog";
import { L } from "./copy";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import type { I18nText, OrderValues, SheetId } from "./types";

export interface OrderPreset {
  id: string;
  family: string;
  sheetId: SheetId;
  title: I18nText;
  blurb: I18nText;
  values: OrderValues;
}

/** Real OneDrive OS orders — one-click starting points, no contact cards. */
export const ORDER_PRESETS: OrderPreset[] = [
  {
    id: "mee-tienyen-cv2",
    family: "CV2",
    sheetId: "oltc",
    title: L(
      "MEE · EVN Tiên Yên CV2",
      "MEE · EVN Tiên Yên CV2",
      "MEE · EVN Tiên Yên CV2",
      "MEE · EVN Tiên Yên CV2",
    ),
    blurb: L(
      "越南电网 40 MVA / 115 kV，真空复合 19 档 ±16%，CMA7。",
      "Vietnam network 40 MVA / 115 kV, vacuum compound 19 pos ±16%, CMA7.",
      "Вьетнам 40 МВА / 115 кВ, 19 положений ±16%, CMA7.",
      "Lưới Việt Nam 40 MVA / 115 kV, 19 nấc ±16%, CMA7.",
    ),
    values: {
      family: "CV2",
      project: "EVN Tiên Yên",
      country: "Vietnam",
      quantity: "1",
      application: "network",
      tx_kind: "separated",
      rated_power_mva: "40",
      hv_kv: "115",
      vector_group: "YNd11yn12",
      frequency_hz: "50",
      phases: "III",
      oltc_current_a: "350",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      regulation: "reversing",
      plus_minus: "9",
      oltc_tap_mid: "1",
      tap_range_pct: "±9×1.78%",
      step_voltage_v: "1181.83",
      through_current_a: "200.82",
      imax_a: "239.07",
      flange_type: "tank_top",
      mdu_model: "CMA7",
      paint: "RAL7033",
      corrosive_class: "C4-H",
      nameplate_language: "en",
      protective_relay:
        "QJ4-25,flange with groove,one N/O contact (oil flow),one N/O contact(gas alarm), only for vacuum OLTC",
      drive_shaft_horizontal_mm: "2000",
      drive_shaft_vertical_mm: "2000",
      pipe_q: "With bleeder, flange with groove",
      pipe_q_height: "181",
      pipe_s: "With bleeder, flange without groove",
      pipe_s_height: "181",
      pipe_r: "With bleeder, flange with groove",
      pipe_r_height: "181",
      pipe_e2: "Blind flange on OLTC head*",
      notes: "OS 写 CV2-500 和选择器 C，向导按目录 CV2 350 起。",
    },
  },
  {
    id: "hlg-havec-cv",
    family: "CV",
    sheetId: "oltc",
    title: L(
      "Havec · 柬埔寨 CV",
      "Havec · Cambodia CV",
      "Havec · Камбоджа CV",
      "Havec · Campuchia CV",
    ),
    blurb: L(
      "柬埔寨自耦 12 MVA / 35 kV，CV-350，CMA7。",
      "Cambodia autotransformer 12 MVA / 35 kV, CV-350, CMA7.",
      "Камбоджа автотрансформатор 12 МВА / 35 кВ, CV-350, CMA7.",
      "Campuchia tự ngẫu 12 MVA / 35 kV, CV-350, CMA7.",
    ),
    values: {
      family: "CV",
      project: "Havec Cambodia",
      country: "Cambodia",
      quantity: "1",
      application: "network",
      tx_kind: "auto",
      rated_power_mva: "12",
      hv_kv: "35",
      vector_group: "YNa0",
      frequency_hz: "50",
      phases: "III",
      oltc_current_a: "350",
      oltc_um_kv: "40.5",
      oltc_connection: "D",
      regulation: "reversing",
      plus_minus: "13",
      oltc_tap_mid: "1",
      range_minus: "20",
      range_plus: "6",
      tap_range_pct: "−20/+6%",
      step_voltage_v: "202",
      through_current_a: "300",
      imax_a: "300",
      mdu_model: "CMA7",
      paint: "RAL7033",
      corrosive_class: "C4-M",
      nameplate_language: "en",
      potential_connection: "check",
      protective_relay: "QJ6-25,flange with groove,two N/O contacts (oil flow)",
      notes: "自耦变，27 档 −20/+6%；通过电流 300 A，开关按目录 CV-350。",
    },
  },
  {
    id: "ue-hwv",
    family: "HWV",
    sheetId: "hwv",
    title: L(
      "United Energy · HWV",
      "United Energy · HWV",
      "United Energy · HWV",
      "United Energy · HWV",
    ),
    blurb: L(
      "澳洲约 20 MVA / 66 kV，外附真空 HWV-400Y，19 档。",
      "Australia ~20 MVA / 66 kV, external-tank HWV-400Y, 19 positions.",
      "Австралия ~20 МВА / 66 кВ, HWV-400Y, 19 положений.",
      "Úc ~20 MVA / 66 kV, HWV-400Y thùng phụ, 19 nấc.",
    ),
    values: {
      family: "HWV",
      project: "United Energy Wilson retrofit",
      country: "Australia",
      quantity: "1",
      application: "power",
      rated_power_mva: "20",
      hv_kv: "66",
      frequency_hz: "50",
      phases: "III",
      oltc_current_a: "400",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      regulation: "reversing",
      plus_minus: "8",
      oltc_tap_mid: "3",
      mdu_model: "CMA7",
      nameplate_language: "en",
      notes: "Wilson 1981 储油柜、Ferranti EST 6LF 改造；过渡法兰要另议。",
    },
  },
  {
    id: "mee-wsl",
    family: "WSL",
    sheetId: "octc",
    title: L(
      "MEE · EVN NPC WSL",
      "MEE · EVN NPC WSL",
      "MEE · EVN NPC WSL",
      "MEE · EVN NPC WSL",
    ),
    blurb: L(
      "越南 40 MVA / 38.5 kV 无励磁，钟罩手轮。",
      "Vietnam 40 MVA / 38.5 kV de-energized, bell tank, handwheel.",
      "Вьетнам 40 МВА / 38.5 кВ, колокол, штурвал.",
      "Việt Nam 40 MVA / 38.5 kV cắt điện, chuông, tay quay.",
    ),
    values: {
      family: "WSL",
      project: "EVN NPC",
      country: "Vietnam",
      quantity: "1",
      application: "power",
      rated_power_mva: "40",
      hv_kv: "38.5",
      frequency_hz: "50",
      phases: "III",
      octc_series: "II",
      current_a: "600",
      um_kv: "72.5",
      connection: "D",
      octc_positions: "5",
      octc_contact: "6x5",
      octc_size: "A",
      octc_drive: "handwheel",
      nameplate_language: "en",
      notes: "钟罩、手轮；变压器侧 ±2×2.5%，档位 1 / 3 / 5。",
    },
  },
  {
    id: "bambang-cz",
    family: "CZ",
    sheetId: "dry",
    title: L(
      "Bambangdjaja · 3×CZI-500",
      "Bambangdjaja · 3×CZI-500",
      "Bambangdjaja · 3×CZI-500",
      "Bambangdjaja · 3×CZI-500",
    ),
    blurb: L(
      "印尼干变，三台单相 CZ、一台 CMA7。",
      "Indonesia dry-type: three single-phase CZ, one CMA7.",
      "Индонезия, сухой: 3 однофазных CZ, один CMA7.",
      "Indonesia MBA khô: 3 CZ một pha, một CMA7.",
    ),
    values: {
      family: "CZ",
      project: "Bambangdjaja 3×CZI-500",
      country: "Indonesia",
      quantity: "1",
      application: "power",
      frequency_hz: "50",
      unit_count: "3",
      phases: "I",
      oltc_current_a: "500",
      oltc_um_kv: "40.5",
      dry_positions: "17",
      mdu_model: "CMA7",
      nameplate_language: "en",
      notes: "三相干变订 3 台单相 CZ，一台 CMA7 联动。",
    },
  },
  {
    id: "tirathai-cv",
    family: "CV",
    sheetId: "oltc",
    title: L(
      "Tirathai · 泰国试验变 CV",
      "Tirathai · Thailand test CV",
      "Tirathai · Таиланд испытательный CV",
      "Tirathai · MBA thử Thái Lan CV",
    ),
    blurb: L(
      "泰国试验室 6.93 kV，粗细调 12233G，CMA7。",
      "Thailand test lab 6.93 kV, coarse–fine 12233G, CMA7.",
      "Таиланд 6.93 кВ, грубо-точный 12233G, CMA7.",
      "Thái Lan phòng thử 6.93 kV, thô–tinh 12233G, CMA7.",
    ),
    values: {
      family: "CV",
      project: "Tirathai test laboratory",
      country: "Thailand",
      quantity: "1",
      application: "test",
      tx_kind: "separated",
      rated_power_mva: "2",
      hv_kv: "6.93",
      vector_group: "YNd1",
      frequency_hz: "50",
      phases: "III",
      oltc_current_a: "350",
      oltc_um_kv: "40.5",
      oltc_connection: "D",
      regulation: "coarse_fine",
      plus_minus: "10",
      oltc_tap_mid: "3",
      tap_range_pct: "0–100%",
      step_voltage_v: "346.5",
      mdu_model: "CMA7",
      paint: "RAL7001",
      nameplate_language: "en",
      protective_relay: "QJ6-25,flange with groove,two N/O contacts (oil flow)",
      drive_shaft_horizontal_mm: "1000",
      notes:
        "试验变 1600/2000 kVA，从第 20 档起容量下降；调压 0–100%，接线图 12233G。",
    },
  },
  {
    id: "bambang-px360",
    family: "CMA7",
    sheetId: "cma7",
    title: L(
      "Bambangdjaja · PX-360 CMA7",
      "Bambangdjaja · PX-360 CMA7",
      "Bambangdjaja · PX-360 CMA7",
      "Bambangdjaja · PX-360 CMA7",
    ),
    blurb: L(
      "印尼 PX-360 机构，33 档，60 Hz。",
      "Indonesia PX-360 drive, 33 positions, 60 Hz.",
      "Индонезия PX-360, 33 положения, 60 Гц.",
      "Indonesia PX-360, 33 nấc, 60 Hz.",
    ),
    values: {
      project: "PX-360",
      country: "Indonesia",
      quantity: "1",
      frequency_hz: "60",
      mdu_positions: "33",
      motor_voltage: "230_1",
      control_voltage: "230_ac",
      parallel: "yes",
      paint: "ANSI70",
      nameplate_language: "en",
      notes:
        "档位 1 / 17A,17B,17C / 33；电机、控制和加热都是 230 V 60 Hz，漆 ANSI 70，绝缘用 FR3。",
    },
  },
  {
    id: "trafoindo-salak-cv2",
    family: "CV2",
    sheetId: "oltc",
    title: L(
      "Trafoindo · Salak 7 CV2",
      "Trafoindo · Salak 7 CV2",
      "Trafoindo · Salak 7 CV2",
      "Trafoindo · Salak 7 CV2",
    ),
    blurb: L(
      "印尼 Salak 7 · 6.5 MVA / 11.8 kV，真空复合 350 A。",
      "Indonesia Salak 7 · 6.5 MVA / 11.8 kV, vacuum compound 350 A.",
      "Индонезия Salak 7 · 6.5 МВА / 11.8 кВ, 350 А.",
      "Indonesia Salak 7 · 6.5 MVA / 11.8 kV, chân không 350 A.",
    ),
    values: {
      family: "CV2",
      project: "Trafoindo Salak 7",
      country: "Indonesia",
      quantity: "1",
      application: "power",
      rated_power_mva: "6.5",
      hv_kv: "11.8",
      frequency_hz: "50",
      phases: "III",
      ambient_temp: "Max +45 °C",
      oltc_current_a: "350",
      oltc_um_kv: "40.5",
      oltc_connection: "D",
      regulation: "reversing",
      plus_minus: "8",
      oltc_tap_mid: "3",
      tap_range_pct: "±8×1.25%",
      step_voltage_v: "147.5",
      through_current_a: "183.6",
      flange_type: "bell",
      mdu_model: "CMA7",
      paint: "RAL7032",
      corrosive_class: "C5-M",
      nameplate_language: "en",
      drive_shaft_horizontal_mm: "2000",
      drive_shaft_vertical_mm: "2000",
      notes: "配 CMA7 和 SHM-KX；H2S 环境。",
    },
  },
];

export function getPreset(id: string | null | undefined): OrderPreset | undefined {
  if (!id) return undefined;
  const raw = id.trim();
  const direct = ORDER_PRESETS.find(
    (p) => p.id === raw.toLowerCase() || p.family === raw.toUpperCase(),
  );
  if (direct) return direct;
  const fam = getFamily(raw);
  return fam ? ORDER_PRESETS.find((p) => p.family === fam.code) : undefined;
}

/** Spec starter kits — never copy a salesperson/customer contact card. */
export const PRESET_CONTACT_KEYS = [
  "designer_name",
  "designer_email",
  "designer_phone",
  "designer_phone_cc",
  "designer_phone_cc_other",
  "buyer",
  "end_user",
] as const;

export function applyPreset(preset: OrderPreset): OrderValues {
  const next = deriveValues({}, { ...SHEET_DEFAULTS[preset.sheetId], ...preset.values });
  for (const key of PRESET_CONTACT_KEYS) {
    next[key] = "";
  }
  return next;
}

export function pendingPresetKey(id: SheetId): string {
  return `hm-os:pending-preset:${id}`;
}

/** Apply ?preset= once; otherwise restore stored draft onto sheet defaults. */
export function hydrateSheetValues(
  id: SheetId,
  search: string,
  stored: OrderValues,
  pendingId?: string | null,
): OrderValues {
  const preset = getPreset(new URLSearchParams(search).get("preset") || pendingId || "");
  if (preset) return applyPreset(preset);
  return deriveValues({}, { ...(SHEET_DEFAULTS[id] ?? {}), ...stored });
}
