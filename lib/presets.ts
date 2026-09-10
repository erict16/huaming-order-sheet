import { getFamily } from "./catalog";
import { L } from "./copy";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import type { I18nText, OrderValues, SheetId } from "./types";

export interface OrderPreset {
  id: string;
  family: string;
  sheetId: "oltc";
  title: I18nText;
  blurb: I18nText;
  values: OrderValues;
}

/** Highest-volume 2025 families — one-click OLTC starting points. */
export const ORDER_PRESETS: OrderPreset[] = [
  {
    id: "cm2",
    family: "CM2",
    sheetId: "oltc",
    title: L("模板-CM2", "Preset CM2", "Шаблон CM2", "Mẫu CM2"),
    blurb: L(
      "真空组合式 · 500 A · 72.5 kV · 中国市场 · 合同后 90 天",
      "Vacuum combined · 500 A · 72.5 kV · China market · 90 days after PO",
      "Вакуумный комбинированный · 500 А · 72.5 кВ",
      "Chân không tổ hợp · 500 A · 72.5 kV · thị trường Trung Quốc · 90 ngày",
    ),
    values: {
      family: "CM2",
      project: "模板-CM2",
      country: "China",
      delivery_date: "90 days after PO",
      application: "power",
      rated_power_mva: "31.5",
      hv_kv: "110",
      lv_kv: "10.5",
      vector_group: "YNd11",
      oltc_current_a: "500",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      tap_range_pct: "±8×1.25%",
      paint: "RAL7032",
      nameplate_language: "zh",
    },
  },
  {
    id: "shzv",
    family: "SHZV",
    sheetId: "oltc",
    title: L("模板-SHZV", "Preset SHZV", "Шаблон SHZV", "Mẫu SHZV"),
    blurb: L(
      "箱内真空 · 600 A · 252 kV · 土耳其市场 · 合同后 120 天",
      "In-tank vacuum · 600 A · 252 kV · Turkey market · 120 days after PO",
      "Вакуумный в баке · 600 А · 252 кВ",
      "Chân không trong thùng · 600 A · 252 kV · thị trường Thổ · 120 ngày",
    ),
    values: {
      family: "SHZV",
      project: "模板-SHZV",
      country: "Turkey",
      delivery_date: "120 days after PO",
      application: "power",
      rated_power_mva: "180",
      hv_kv: "220",
      lv_kv: "10.5",
      vector_group: "YNd11",
      oltc_current_a: "600",
      oltc_um_kv: "252",
      oltc_connection: "Y",
      tap_range_pct: "±8×1.25%",
      mdu_model: "SHM-D",
      paint: "RAL7035",
      nameplate_language: "en",
    },
  },
  {
    id: "cv",
    family: "CV",
    sheetId: "oltc",
    title: L("模板-CV", "Preset CV", "Шаблон CV", "Mẫu CV"),
    blurb: L(
      "油浸复合式 · 350 A · 40.5 kV · 印尼市场 · 合同后 90 天",
      "Oil compound · 350 A · 40.5 kV · Indonesia market · 90 days after PO",
      "Масляный составной · 350 А · 40.5 кВ",
      "Dầu compound · 350 A · 40.5 kV · thị trường Indonesia · 90 ngày",
    ),
    values: {
      family: "CV",
      project: "模板-CV",
      country: "Indonesia",
      delivery_date: "90 days after PO",
      application: "power",
      rated_power_mva: "20",
      hv_kv: "35",
      lv_kv: "10.5",
      vector_group: "Dyn11",
      oltc_current_a: "350",
      oltc_um_kv: "40.5",
      oltc_connection: "Y",
      tap_range_pct: "±8×1.25%",
      flange_type: "tank_top",
      paint: "RAL7032",
      nameplate_language: "en",
    },
  },
  {
    id: "cm",
    family: "CM",
    sheetId: "oltc",
    title: L("模板-CM", "Preset CM", "Шаблон CM", "Mẫu CM"),
    blurb: L(
      "油浸组合式 · 500 A · 126 kV · 印度市场 · 合同后 150 天",
      "Oil combined · 500 A · 126 kV · India market · 150 days after PO",
      "Масляный комбинированный · 500 А · 126 кВ",
      "Dầu tổ hợp · 500 A · 126 kV · thị trường Ấn Độ · 150 ngày",
    ),
    values: {
      family: "CM",
      project: "模板-CM",
      country: "India",
      delivery_date: "150 days after PO",
      application: "power",
      rated_power_mva: "63",
      hv_kv: "132",
      lv_kv: "11",
      vector_group: "YNd11",
      oltc_current_a: "500",
      oltc_um_kv: "126",
      oltc_connection: "Y",
      tap_range_pct: "±8×1.25%",
      paint: "RAL7035",
      nameplate_language: "en",
    },
  },
  {
    id: "cv2",
    family: "CV2",
    sheetId: "oltc",
    title: L("模板-CV2", "Preset CV2 / VCV", "Шаблон CV2", "Mẫu CV2"),
    blurb: L(
      "真空复合式 VCV · 350 A · 72.5 kV · 越南市场 · 合同后 90 天",
      "Vacuum compound VCV · 350 A · 72.5 kV · Vietnam market · 90 days after PO",
      "Вакуумный составной VCV · 350 А · 72.5 кВ",
      "Chân không compound VCV · 350 A · 72.5 kV · thị trường Việt Nam · 90 ngày",
    ),
    values: {
      family: "CV2",
      project: "模板-CV2",
      country: "Vietnam",
      delivery_date: "90 days after PO",
      application: "power",
      rated_power_mva: "25",
      hv_kv: "66",
      lv_kv: "22",
      vector_group: "YNd11",
      oltc_current_a: "350",
      oltc_um_kv: "72.5",
      oltc_connection: "Y",
      tap_range_pct: "±8×1.25%",
      flange_type: "tank_top",
      paint: "RAL7032",
      nameplate_language: "en",
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
