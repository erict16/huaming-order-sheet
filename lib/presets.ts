import { getFamily } from "./catalog";
import { L } from "./copy";
import { SHEET_DEFAULTS } from "./defaults";
import { deriveValues } from "./derive";
import type { I18nText, OrderValues } from "./types";

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
      "真空组合式 · 500 A · 72.5 kV · 中国 +86 · 合同后 90 天",
      "Vacuum combined · 500 A · 72.5 kV · China +86 · 90 days after PO",
      "Вакуумный комбинированный · 500 А · 72.5 кВ",
      "Chân không tổ hợp · 500 A · 72.5 kV · +86 · 90 ngày",
    ),
    values: {
      family: "CM2",
      project: "模板-CM2",
      country: "China",
      designer_phone_cc: "+86",
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
      "箱内真空 · 600 A · 252 kV · 土耳其 +90 · 合同后 120 天",
      "In-tank vacuum · 600 A · 252 kV · Turkey +90 · 120 days after PO",
      "Вакуумный в баке · 600 А · 252 кВ",
      "Chân không trong thùng · 600 A · 252 kV · +90 · 120 ngày",
    ),
    values: {
      family: "SHZV",
      project: "模板-SHZV",
      country: "Turkey",
      designer_phone_cc: "+90",
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
      "油浸复合式 · 350 A · 40.5 kV · 印尼 +62 · 合同后 90 天",
      "Oil compound · 350 A · 40.5 kV · Indonesia +62 · 90 days after PO",
      "Масляный составной · 350 А · 40.5 кВ",
      "Dầu compound · 350 A · 40.5 kV · +62 · 90 ngày",
    ),
    values: {
      family: "CV",
      project: "模板-CV",
      country: "Indonesia",
      designer_phone_cc: "+62",
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
      "油浸组合式 · 500 A · 126 kV · 印度 +91 · 合同后 150 天",
      "Oil combined · 500 A · 126 kV · India +91 · 150 days after PO",
      "Масляный комбинированный · 500 А · 126 кВ",
      "Dầu tổ hợp · 500 A · 126 kV · +91 · 150 ngày",
    ),
    values: {
      family: "CM",
      project: "模板-CM",
      country: "India",
      designer_phone_cc: "+91",
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
      "真空复合式 VCV · 350 A · 72.5 kV · 越南 +84 · 合同后 90 天",
      "Vacuum compound VCV · 350 A · 72.5 kV · Vietnam +84 · 90 days after PO",
      "Вакуумный составной VCV · 350 А · 72.5 кВ",
      "Chân không compound VCV · 350 A · 72.5 kV · +84 · 90 ngày",
    ),
    values: {
      family: "CV2",
      project: "模板-CV2",
      country: "Vietnam",
      designer_phone_cc: "+84",
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

export function applyPreset(preset: OrderPreset): OrderValues {
  return deriveValues({}, { ...SHEET_DEFAULTS[preset.sheetId], ...preset.values });
}
