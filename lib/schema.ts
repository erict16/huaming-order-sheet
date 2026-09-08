// The single source of truth for the order sheet: sections (A-J) and their
// fields. Both the form UI and the Excel export walk this schema, so a field
// can never appear on the form but be missing from the Excel.

import { Locale } from "./i18n";
import {
  APPLICATION_LABELS_ZH,
  APPLICATIONS,
  CONNECTIONS,
  CONNECTION_LABELS,
  CONNECTION_LABELS_ZH,
  CONTROLLERS,
  CURRENT_A,
  FAMILIES,
  FamilyDef,
  FLANGE_LABELS_ZH,
  FLANGE_TYPES,
  FREQUENCY_HZ,
  getFamily,
  INSULATING_FLUID,
  INSULATING_FLUID_LABELS_ZH,
  MDU_MODELS,
  NAMEPLATE_LANGUAGE_LABELS,
  NAMEPLATE_LANGUAGE_LABELS_ZH,
  NAMEPLATE_LANGUAGES,
  NONE_LABELS_ZH,
  OIL_FILTERS,
  PHASES,
  PHASE_LABELS,
  PHASE_LABELS_ZH,
  PIPE_FITTING_LABELS_ZH,
  PIPE_FITTINGS,
  PRESSURE_RELIEF,
  PRESSURE_RELIEF_LABELS_ZH,
  PROTECTIVE_RELAYS,
  REGULATION,
  REGULATION_LABELS,
  REGULATION_LABELS_ZH,
  SELECTOR_GRADES,
  STANDARDS,
  UM_KV,
  YES_NO,
  YES_NO_LABELS_ZH,
} from "./catalog";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface FieldOption {
  value: string;
  labelEn: string;
  labelZh: string;
}

export interface FieldDef {
  key: string;
  labelEn: string;
  labelZh: string;
  type: FieldType;
  unit?: string;
  options?: FieldOption[];
  placeholder?: string;
  placeholderZh?: string;
  required?: boolean;
  /** When set, the field only applies to families for which this returns true. */
  appliesTo?: (family: FamilyDef | undefined) => boolean;
}

export interface SectionDef {
  id: string;
  titleEn: string;
  titleZh: string;
  /** Whether the whole section is family-specific. */
  familySpecific?: boolean;
  fields: FieldDef[];
}

function opts(
  values: readonly (string | number)[],
  labelsEn?: Record<string, string>,
  labelsZh?: Record<string, string>,
): FieldOption[] {
  return values.map((v) => {
    const key = String(v);
    const labelEn = labelsEn?.[key] ?? key;
    const labelZh = labelsZh?.[key] ?? labelEn;
    return { value: key, labelEn, labelZh };
  });
}

const familyOptions: FieldOption[] = FAMILIES.map((f) => {
  const label = f.aliases?.length ? `${f.code} (${f.aliases.join("/")})` : f.code;
  return { value: f.code, labelEn: label, labelZh: label };
});

export const SECTIONS: SectionDef[] = [
  {
    id: "order",
    titleEn: "Order / contact",
    titleZh: "订单 / 联系",
    fields: [
      { key: "order_no", labelEn: "Order no.", labelZh: "订单号", type: "text" },
      { key: "order_date", labelEn: "Date", labelZh: "日期", type: "text", placeholder: "YYYY-MM-DD" },
      { key: "buyer", labelEn: "Buyer / transformer maker", labelZh: "买方 / 变压器厂", type: "text" },
      { key: "end_user", labelEn: "End user", labelZh: "最终用户", type: "text" },
      { key: "country", labelEn: "Country", labelZh: "国家", type: "text" },
      { key: "project", labelEn: "Project", labelZh: "工程", type: "text" },
      { key: "quantity", labelEn: "Quantity", labelZh: "数量", type: "number", unit: "pcs" },
      { key: "designer_name", labelEn: "Designer name", labelZh: "设计人", type: "text" },
      { key: "designer_email", labelEn: "Designer email", labelZh: "设计人邮箱", type: "text" },
      { key: "designer_phone", labelEn: "Designer phone", labelZh: "设计人电话", type: "text" },
      { key: "hm_product_no", labelEn: "Huaming product no.", labelZh: "华明产品号", type: "text" },
      { key: "delivery_date", labelEn: "Delivery date", labelZh: "交货期", type: "text", placeholder: "YYYY-MM-DD" },
    ],
  },
  {
    id: "general",
    titleEn: "General data",
    titleZh: "通用数据",
    fields: [
      { key: "application", labelEn: "Application", labelZh: "用途", type: "select", options: opts(APPLICATIONS, undefined, APPLICATION_LABELS_ZH) },
      { key: "phases", labelEn: "Phases", labelZh: "相数", type: "select", required: true, options: opts(PHASES, PHASE_LABELS, PHASE_LABELS_ZH) },
      { key: "frequency_hz", labelEn: "Frequency", labelZh: "频率", type: "select", unit: "Hz", options: opts(FREQUENCY_HZ) },
      { key: "standard", labelEn: "Standard", labelZh: "标准", type: "select", options: opts(STANDARDS) },
      { key: "ambient_temp_class", labelEn: "Ambient temperature class", labelZh: "环境温度等级", type: "text", placeholder: "e.g. -25/+40 °C", placeholderZh: "例如 -25/+40 °C" },
      { key: "altitude_m", labelEn: "Altitude", labelZh: "海拔", type: "number", unit: "m" },
      { key: "insulating_fluid", labelEn: "Insulating fluid", labelZh: "绝缘液体", type: "select", options: opts(INSULATING_FLUID, undefined, INSULATING_FLUID_LABELS_ZH) },
    ],
  },
  {
    id: "range",
    titleEn: "Range (family + drive selection)",
    titleZh: "系列与传动",
    fields: [
      { key: "family", labelEn: "Tap-changer family", labelZh: "分接开关系列", type: "select", options: familyOptions },
      { key: "mdu_model", labelEn: "Motor drive unit (MDU)", labelZh: "电动机构 (MDU)", type: "select", options: opts(MDU_MODELS, undefined, NONE_LABELS_ZH) },
      { key: "controller", labelEn: "Controller", labelZh: "控制器", type: "select", options: opts(CONTROLLERS, undefined, NONE_LABELS_ZH) },
      { key: "oil_filter", labelEn: "Online oil filter", labelZh: "在线滤油机", type: "select", options: opts(OIL_FILTERS, undefined, NONE_LABELS_ZH) },
      { key: "protective_relay", labelEn: "Protective relay", labelZh: "气体继电器", type: "select", options: opts(PROTECTIVE_RELAYS, undefined, NONE_LABELS_ZH) },
      { key: "rain_cover", labelEn: "Rain cover", labelZh: "防雨罩", type: "select", options: opts(YES_NO, undefined, YES_NO_LABELS_ZH) },
    ],
  },
  {
    id: "transformer",
    titleEn: "Transformer data",
    titleZh: "变压器数据",
    fields: [
      { key: "rated_power_kva", labelEn: "Rated power", labelZh: "额定容量", type: "number", unit: "kVA" },
      { key: "hv_kv", labelEn: "Rated voltage HV", labelZh: "高压额定电压", type: "number", unit: "kV" },
      { key: "lv_kv", labelEn: "Rated voltage LV", labelZh: "低压额定电压", type: "number", unit: "kV" },
      { key: "tap_range_pct", labelEn: "Tap range", labelZh: "调压范围", type: "text", unit: "%", placeholder: "e.g. ±8×1.25%", placeholderZh: "例如 ±8×1.25%" },
      { key: "steps", labelEn: "Number of steps (±)", labelZh: "级数 (±)", type: "number" },
      { key: "regulated_winding", labelEn: "Regulated winding & connection", labelZh: "调压绕组及接法", type: "text" },
      { key: "through_current_a", labelEn: "Through-current I", labelZh: "通过电流 I", type: "number", unit: "A" },
      { key: "max_current_a", labelEn: "Max current", labelZh: "最大电流", type: "number", unit: "A" },
      { key: "step_voltage_v", labelEn: "Step voltage Ust", labelZh: "级电压 Ust", type: "number", unit: "V" },
      { key: "regulation", labelEn: "Regulation mode", labelZh: "调压方式", type: "select", options: opts(REGULATION, REGULATION_LABELS, REGULATION_LABELS_ZH) },
      { key: "vector_diagram", labelEn: "Winding vector / tap diagram", labelZh: "绕组矢量 / 分接示意图", type: "text" },
    ],
  },
  {
    id: "oltc",
    titleEn: "On-load tap changer data",
    titleZh: "有载分接开关数据",
    familySpecific: true,
    fields: [
      { key: "oltc_current_a", labelEn: "Rated through-current Ium", labelZh: "额定通过电流 Ium", type: "select", unit: "A", options: opts(CURRENT_A) },
      { key: "oltc_um_kv", labelEn: "Highest voltage Um", labelZh: "最高电压 Um", type: "select", unit: "kV", options: opts(UM_KV) },
      { key: "oltc_connection", labelEn: "Connection", labelZh: "接法", type: "select", options: opts(CONNECTIONS, CONNECTION_LABELS, CONNECTION_LABELS_ZH) },
      {
        key: "oltc_selector_grade",
        labelEn: "Selector insulation grade",
        labelZh: "选择开关绝缘等级",
        type: "select",
        options: opts(SELECTOR_GRADES),
        appliesTo: (fam) => !!fam?.hasSelectorGrade,
      },
      { key: "oltc_tap_pitch", labelEn: "Tap-selector pitch", labelZh: "选择开关节距", type: "number" },
      { key: "oltc_tap_positions", labelEn: "Service positions", labelZh: "工作档位", type: "number" },
      { key: "oltc_tap_mid", labelEn: "Mid positions", labelZh: "中间档位", type: "number" },
      { key: "oltc_ust_max_v", labelEn: "Step voltage max", labelZh: "级电压最大", type: "number", unit: "V" },
      { key: "oltc_ust_min_v", labelEn: "Step voltage min", labelZh: "级电压最小", type: "number", unit: "V" },
    ],
  },
  {
    id: "position",
    titleEn: "Range / position definition",
    titleZh: "档位定义",
    familySpecific: true,
    fields: [
      { key: "pos_max", labelEn: "Max position no.", labelZh: "最高档位号", type: "number" },
      { key: "pos_mid", labelEn: "Mid position no.", labelZh: "中间档位号", type: "number" },
      { key: "pos_min", labelEn: "Min position no.", labelZh: "最低档位号", type: "number" },
      { key: "raise_direction", labelEn: "Raise-voltage direction", labelZh: "升压方向", type: "text" },
    ],
  },
  {
    id: "mechanical",
    titleEn: "Mechanical / mounting",
    titleZh: "机械 / 安装",
    familySpecific: true,
    fields: [
      { key: "flange_type", labelEn: "Mounting flange", labelZh: "安装法兰", type: "select", options: opts(FLANGE_TYPES, undefined, FLANGE_LABELS_ZH) },
      { key: "drive_shaft_horizontal_mm", labelEn: "Horizontal drive-shaft length", labelZh: "水平传动轴长度", type: "number", unit: "mm" },
      { key: "drive_shaft_vertical_mm", labelEn: "Vertical drive-shaft length", labelZh: "垂直传动轴长度", type: "number", unit: "mm" },
      { key: "head_variant", labelEn: "Head variant", labelZh: "头部型式", type: "text" },
    ],
  },
  {
    id: "insulation",
    titleEn: "Insulation data",
    titleZh: "绝缘数据",
    familySpecific: true,
    fields: [
      { key: "ins_earth_pf_kv", labelEn: "Earth power-frequency withstand", labelZh: "对地工频耐压", type: "number", unit: "kV" },
      { key: "ins_earth_li_kv", labelEn: "Earth lightning impulse", labelZh: "对地雷电冲击", type: "number", unit: "kV" },
      { key: "ins_distance_note", labelEn: "Internal distances (a, a1, b, c1, c2, d)", labelZh: "内部距离 (a, a1, b, c1, c2, d)", type: "text" },
    ],
  },
  {
    id: "accessories",
    titleEn: "Accessories / special options",
    titleZh: "附件 / 选项",
    fields: [
      { key: "pipe_fittings", labelEn: "Pipe fittings", labelZh: "管接头", type: "select", options: opts(PIPE_FITTINGS, undefined, PIPE_FITTING_LABELS_ZH) },
      { key: "pressure_relief", labelEn: "Pressure relief", labelZh: "压力释放", type: "select", options: opts(PRESSURE_RELIEF, undefined, PRESSURE_RELIEF_LABELS_ZH) },
      { key: "terminal_shields", labelEn: "Terminal shields", labelZh: "出线屏蔽", type: "select", options: opts(YES_NO, undefined, YES_NO_LABELS_ZH) },
      { key: "paint", labelEn: "Paint (RAL)", labelZh: "油漆 (RAL)", type: "text", placeholder: "e.g. RAL 7040", placeholderZh: "例如 RAL 7040" },
      { key: "nameplate_language", labelEn: "Nameplate language", labelZh: "铭牌语言", type: "select", options: opts(NAMEPLATE_LANGUAGES, NAMEPLATE_LANGUAGE_LABELS, NAMEPLATE_LANGUAGE_LABELS_ZH) },
      { key: "oil_sampling", labelEn: "Oil sampling", labelZh: "取油样", type: "select", options: opts(YES_NO, undefined, YES_NO_LABELS_ZH) },
    ],
  },
  {
    id: "notes",
    titleEn: "Notes",
    titleZh: "备注",
    fields: [
      { key: "notes", labelEn: "Notes (unfilled = standard supply)", labelZh: "备注（空白 = 常规配置）", type: "textarea" },
    ],
  },
];

export type OrderValues = Record<string, string>;

export function fieldLabel(field: FieldDef, locale: Locale): string {
  return locale === "zh" ? field.labelZh : field.labelEn;
}

export function sectionTitle(section: SectionDef, locale: Locale): string {
  return locale === "zh" ? section.titleZh : section.titleEn;
}

export function optionLabel(option: FieldOption, locale: Locale): string {
  return locale === "zh" ? option.labelZh : option.labelEn;
}

export function displayFieldValue(field: FieldDef, value: string, locale: Locale): string {
  if (!value) return "";
  const opt = field.options?.find((o) => o.value === value);
  if (opt) return optionLabel(opt, locale);
  return value;
}

// Returns the fields of a section that apply to the currently selected family.
export function applicableFields(section: SectionDef, family: string): FieldDef[] {
  const fam = getFamily(family);
  return section.fields.filter((f) => (f.appliesTo ? f.appliesTo(fam) : true));
}

// Flatten all fields across sections (respecting family applicability) — used by
// the Excel export to guarantee every visible parameter is exported.
export function allApplicableFields(family: string): { section: SectionDef; field: FieldDef }[] {
  const out: { section: SectionDef; field: FieldDef }[] = [];
  for (const section of SECTIONS) {
    for (const field of applicableFields(section, family)) {
      out.push({ section, field });
    }
  }
  return out;
}
