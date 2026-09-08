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
    filePrefix: "CMD",
  },
  {
    code: "CM",
    category: "OLTC_OIL",
    hasSelectorGrade: true,
    modeled: true,
    descEn: "Oil, combined (diverter + selector) in-tank OLTC.",
    filePrefix: "M",
  },
  {
    code: "CV",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: true,
    descEn: "Oil, compound selector-switch, on-tank head OLTC.",
    filePrefix: "V",
  },
  {
    code: "SV",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Oil, compound (500 A three-phase variant of CV).",
    filePrefix: "SV",
  },
  {
    code: "CVT",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Dry / air-insulated, vacuum, compound, low-voltage OLTC.",
    filePrefix: "CVT",
  },
  {
    code: "VCM",
    aliases: ["CM2"],
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Oil + vacuum diverter, combined OLTC (vacuum CM / CM2).",
    filePrefix: "CM2",
  },
  {
    code: "VCV",
    aliases: ["CV2"],
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Oil + vacuum, compound OLTC (vacuum CV / CV2).",
    filePrefix: "CV2",
  },
  {
    code: "SHZV",
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Oil + vacuum, combined in-tank OLTC (neutral Y / single-phase).",
    filePrefix: "SHZV",
  },
  {
    code: "SHZVG",
    category: "OLTC_VACUUM",
    hasSelectorGrade: true,
    modeled: false,
    descEn: "Vacuum combined, high-current line (CONFIRM 'G' meaning).",
    filePrefix: "SHZVG",
  },
  {
    code: "HWV",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Vacuum OLTC in external side-tank compartment.",
    filePrefix: "HWV",
  },
  {
    code: "HWDK",
    category: "OLTC_VACUUM",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Vacuum, reactive-transition, on-tank OLTC (NA distribution).",
    filePrefix: "HWDK",
  },
  {
    code: "HMDK",
    category: "SVR",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Reactive distribution step-voltage regulator (not main-power OLTC).",
    filePrefix: "HMDK",
  },
  {
    code: "CZ",
    category: "OLTC_DRY",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Dry-type, vacuum, combined OLTC for dry transformers (not OCTC).",
    filePrefix: "CZ",
  },
  {
    code: "SY",
    category: "OLTC_OIL",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Legacy oil direct-switching OLTC, old 35 kV class (own naming).",
    filePrefix: "S",
  },
  {
    code: "WG",
    category: "OCTC",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Drum-type de-energized tap changer (OCTC/DETC), in-tank.",
    filePrefix: "WG",
  },
  {
    code: "WL",
    aliases: ["W\u25A1L"],
    category: "OCTC",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Cage-type de-energized tap changer (OCTC/DETC), in-tank.",
    filePrefix: "W",
  },
  {
    code: "ZXJY",
    category: "ACCESSORY",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Online oil filter for OLTC oil compartment (not a tap changer).",
    filePrefix: "Y",
  },
  {
    code: "MDU",
    category: "MDU",
    hasSelectorGrade: false,
    modeled: false,
    descEn: "Motor drive unit order (drive + controller).",
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

export const CONNECTIONS = ["Y", "D"] as const;
export const CONNECTION_LABELS: Record<string, string> = {
  Y: "Y — wye / neutral point",
  D: "D — delta / any winding",
};

export const REGULATION = ["linear", "reversing", "coarse_fine"] as const;
export const REGULATION_LABELS: Record<string, string> = {
  linear: "Linear",
  reversing: "Reversing (W)",
  coarse_fine: "Coarse-fine (G)",
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

export const INSULATING_FLUID = [
  "Mineral oil",
  "Natural ester",
  "Synthetic ester",
  "Silicone",
] as const;

// RANGE-block drive/control/accessory option lists.
export const MDU_MODELS = ["CMA7", "SHM-III", "SHM-D", "SHM-DL", "None"] as const;
export const CONTROLLERS = ["HMC-3C", "SHM-K", "ET-SZ6", "HMK-2A", "None"] as const;
export const OIL_FILTERS = ["ZXJY-I", "ZXJY-II", "ZXJY-III", "None"] as const;
export const PROTECTIVE_RELAYS = ["QJ4", "QJ6", "None"] as const;

export const NAMEPLATE_LANGUAGES = ["EN", "RU", "CN", "TR", "PT", "ID"] as const;
