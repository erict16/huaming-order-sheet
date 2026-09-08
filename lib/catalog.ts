// Domain catalog for Huaming tap-changer order sheets.
// Ported/trimmed from the taxonomy used by erict16/oltc-selector and Huaming
// public technical data. Values marked "CONFIRM" in PLAN.md are open questions;
// where a business rule is unknown we keep option lists permissive rather than
// inventing constraints.

export type ProductCategory =
  | "OLTC_OIL"
  | "OLTC_VACUUM"
  | "OLTC_DRY"
  | "OCTC"
  | "SVR"
  | "MDU"
  | "ACCESSORY"
  | "AFTERSALES";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  OLTC_OIL: "OLTC · oil",
  OLTC_VACUUM: "OLTC · vacuum",
  OLTC_DRY: "OLTC · dry",
  OCTC: "OCTC / de-energized",
  SVR: "Step-voltage regulator",
  MDU: "Motor drive unit",
  ACCESSORY: "Accessory",
  AFTERSALES: "Aftersales spares",
};

export const CATEGORY_LABELS_ZH: Record<ProductCategory, string> = {
  OLTC_OIL: "有载 · 油浸",
  OLTC_VACUUM: "有载 · 真空",
  OLTC_DRY: "有载 · 干式",
  OCTC: "无励磁 / 断电调压",
  SVR: "线路调压器",
  MDU: "电动机构",
  ACCESSORY: "附件",
  AFTERSALES: "售后备件",
};

export function categoryLabel(cat: ProductCategory, locale: "zh" | "en"): string {
  return locale === "zh" ? CATEGORY_LABELS_ZH[cat] : CATEGORY_LABELS[cat];
}

export interface FamilyDef {
  /** Canonical family code used across the app + Excel. */
  code: string;
  /** Display aliases (e.g. VCM shows CM2). */
  aliases?: string[];
  category: ProductCategory;
  /** Whether this family carries a tap-selector insulation grade (B/C/D/DE). */
  hasSelectorGrade: boolean;
  /** True when the family is fully modeled in v0; false = selectable stub. */
  modeled: boolean;
  /** Short EN description shown when picking the family. */
  descEn: string;
  /** Short ZH description shown when picking the family. */
  descZh: string;
  /** Order-sheet file prefix, e.g. E-<prefix>. */
  filePrefix: string;
}

export const FAMILIES: FamilyDef[] = [
  {
    code: "CMD",
    category: "OLTC_OIL",
    hasSelectorGrade: true,
    modeled: true,
    descEn: "Oil, combined, high-current in-tank OLTC.",
    descZh: "油浸、组合式、大电流箱内有载分接开关。",
    filePrefix: "CMD",
  },
  {
    code: "CM",
    category: "OLTC_OIL",
    hasSelectorGrade: true,
    modeled: true,
    descEn: "Oil, combined (diverter + selector) in-tank OLTC.",
    descZh: "油浸、组合式（切换开关 + 选择开关）箱内有载分接开关。",
    filePrefix: "M",
  },
  {
    code: "CV",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: true,
    descEn: "Oil, compound selector-switch, on-tank head OLTC.",
    descZh: "油浸、复合式选择开关，箱顶安装有载分接开关。",
    filePrefix: "V",
  },
  {
    code: "SV",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Oil, compound (500 A three-phase variant of CV).",
    descZh: "油浸、复合式（CV 的 500 A 三相变型）。",
    filePrefix: "SV",
  },
  {
    code: "CVT",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Dry / air-insulated, vacuum, compound, low-voltage OLTC.",
    descZh: "干式 / 空气绝缘、真空、复合式低压有载分接开关。",
    filePrefix: "CVT",
  },
  {
    code: "VCM",
    aliases: ["CM2"],
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Oil + vacuum diverter, combined OLTC (vacuum CM / CM2).",
    descZh: "油浸 + 真空切换、组合式有载分接开关（真空 CM / CM2）。",
    filePrefix: "CM2",
  },
  {
    code: "VCV",
    aliases: ["CV2"],
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Oil + vacuum, compound OLTC (vacuum CV / CV2).",
    descZh: "油浸 + 真空、复合式有载分接开关（真空 CV / CV2）。",
    filePrefix: "CV2",
  },
  {
    code: "SHZV",
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Oil + vacuum, combined in-tank OLTC (neutral Y / single-phase).",
    descZh: "油浸 + 真空、组合式箱内有载分接开关（中性点 Y / 单相）。",
    filePrefix: "SHZV",
  },
  {
    code: "SHZVG",
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Vacuum combined, high-current line (CONFIRM 'G' meaning).",
    descZh: "真空组合式大电流系列（“G”含义待确认）。",
    filePrefix: "SHZVG",
  },
  {
    code: "HWV",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Vacuum OLTC in external side-tank compartment.",
    descZh: "外附油箱式真空有载分接开关。",
    filePrefix: "HWV",
  },
  {
    code: "HWDK",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Vacuum, reactive-transition, on-tank OLTC (NA distribution).",
    descZh: "真空、电抗过渡、箱顶安装有载分接开关（配电）。",
    filePrefix: "HWDK",
  },
  {
    code: "HMDK",
    category: "SVR",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Reactive distribution step-voltage regulator (not main-power OLTC).",
    descZh: "电抗式配电线路调压器（非主变有载开关）。",
    filePrefix: "HMDK",
  },
  {
    code: "CZ",
    category: "OLTC_DRY",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Dry-type, vacuum, combined OLTC for dry transformers (not OCTC).",
    descZh: "干式真空组合式有载分接开关（用于干式变压器，非无励磁）。",
    filePrefix: "CZ",
  },
  {
    code: "SY",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Legacy oil direct-switching OLTC, old 35 kV class (own naming).",
    descZh: "早期油浸直接切换有载分接开关，旧 35 kV 级（独立型号规则）。",
    filePrefix: "S",
  },
  {
    code: "WG",
    category: "OCTC",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Drum-type de-energized tap changer (OCTC/DETC), in-tank.",
    descZh: "鼓形无励磁分接开关，箱内安装。",
    filePrefix: "WG",
  },
  {
    code: "WL",
    aliases: ["W\u25A1L"],
    category: "OCTC",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Cage-type de-energized tap changer (OCTC/DETC), in-tank.",
    descZh: "笼形无励磁分接开关，箱内安装。",
    filePrefix: "W",
  },
  {
    code: "ZXJY",
    category: "ACCESSORY",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Online oil filter for OLTC oil compartment (not a tap changer).",
    descZh: "有载开关油室在线滤油机（不是分接开关）。",
    filePrefix: "Y",
  },
  {
    code: "MDU",
    category: "MDU",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Motor drive unit order (drive + controller).",
    descZh: "电动机构订单（机构 + 控制器）。",
    filePrefix: "D",
  },
];

export function getFamily(code: string): FamilyDef | undefined {
  return FAMILIES.find((f) => f.code === code);
}

// Highest voltage for equipment Um (kV) — IEC 60214 / GB 10230 steps.
export const UM_KV = [12, 17.5, 40.5, 72.5, 126, 145, 170, 252, 300, 363] as const;

// Max rated through-current Ium (A) — discrete catalog set.
export const CURRENT_A = [
  160, 200, 250, 315, 350, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 1800,
  2000, 2400, 3000,
] as const;

// Tap-selector insulation grades (combined families only).
export const SELECTOR_GRADES = ["B", "C", "D", "DE"] as const;

export const PHASES = ["I", "II", "III"] as const;
export const PHASE_LABELS: Record<string, string> = {
  I: "Single-phase (I)",
  II: "Two-phase (II)",
  III: "Three-phase (III)",
};
export const PHASE_LABELS_ZH: Record<string, string> = {
  I: "单相 (I)",
  II: "两相 (II)",
  III: "三相 (III)",
};

export const CONNECTIONS = ["Y", "D"] as const;
export const CONNECTION_LABELS: Record<string, string> = {
  Y: "Y — wye / neutral point",
  D: "D — delta / any winding",
};
export const CONNECTION_LABELS_ZH: Record<string, string> = {
  Y: "Y — 星形 / 中性点",
  D: "D — 三角形 / 任意绕组",
};

export const REGULATION = ["linear", "reversing", "coarse_fine"] as const;
export const REGULATION_LABELS: Record<string, string> = {
  linear: "Linear",
  reversing: "Reversing (W)",
  coarse_fine: "Coarse-fine (G)",
};
export const REGULATION_LABELS_ZH: Record<string, string> = {
  linear: "线性",
  reversing: "正反调 (W)",
  coarse_fine: "粗细调 (G)",
};

export const FREQUENCY_HZ = ["50", "60"] as const;

export const STANDARDS = ["IEC 60214", "GB 10230", "IEEE C57.131"] as const;

export const APPLICATIONS = [
  "Power transformer",
  "Furnace transformer",
  "Rectifier transformer",
  "HVDC / converter",
  "Reactor",
  "Other",
] as const;
export const APPLICATION_LABELS_ZH: Record<string, string> = {
  "Power transformer": "电力变压器",
  "Furnace transformer": "电炉变压器",
  "Rectifier transformer": "整流变压器",
  "HVDC / converter": "高压直流 / 换流",
  Reactor: "电抗器",
  Other: "其他",
};

export const INSULATING_FLUID = [
  "Mineral oil",
  "Natural ester",
  "Synthetic ester",
  "Silicone",
] as const;
export const INSULATING_FLUID_LABELS_ZH: Record<string, string> = {
  "Mineral oil": "矿物油",
  "Natural ester": "天然酯",
  "Synthetic ester": "合成酯",
  Silicone: "硅油",
};

export const YES_NO = ["Yes", "No"] as const;
export const YES_NO_LABELS_ZH: Record<string, string> = {
  Yes: "是",
  No: "否",
};

export const FLANGE_TYPES = ["Tank-top", "Bell (钟罩式)"] as const;
export const FLANGE_LABELS_ZH: Record<string, string> = {
  "Tank-top": "箱顶",
  "Bell (钟罩式)": "钟罩式",
};

export const PIPE_FITTINGS = ["Q", "S", "R", "Standard"] as const;
export const PIPE_FITTING_LABELS_ZH: Record<string, string> = {
  Q: "Q",
  S: "S",
  R: "R",
  Standard: "标准",
};

export const PRESSURE_RELIEF = ["Burst disc", "PRV"] as const;
export const PRESSURE_RELIEF_LABELS_ZH: Record<string, string> = {
  "Burst disc": "爆破片",
  PRV: "压力释放阀",
};

export const NAMEPLATE_LANGUAGE_LABELS: Record<string, string> = {
  EN: "English",
  RU: "Russian",
  CN: "Chinese",
  TR: "Turkish",
  PT: "Portuguese",
  ID: "Indonesian",
};
export const NAMEPLATE_LANGUAGE_LABELS_ZH: Record<string, string> = {
  EN: "英语",
  RU: "俄语",
  CN: "中文",
  TR: "土耳其语",
  PT: "葡萄牙语",
  ID: "印尼语",
};

export const NONE_LABELS_ZH: Record<string, string> = { None: "无" };

// RANGE-block drive/control/accessory option lists.
export const MDU_MODELS = ["CMA7", "SHM-III", "SHM-D", "SHM-DL", "None"] as const;
export const CONTROLLERS = ["HMC-3C", "SHM-K", "ET-SZ6", "HMK-2A", "None"] as const;
export const OIL_FILTERS = ["ZXJY-I", "ZXJY-II", "ZXJY-III", "None"] as const;
export const PROTECTIVE_RELAYS = ["QJ4", "QJ6", "None"] as const;

export const NAMEPLATE_LANGUAGES = ["EN", "RU", "CN", "TR", "PT", "ID"] as const;
