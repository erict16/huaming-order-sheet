// The single source of truth for the order sheet: sections (A-J) and their
// fields. Both the form UI and the Excel export walk this schema, so a field
// can never appear on the form but be missing from the Excel.

import {
  APPLICATIONS,
  CONNECTIONS,
  CONNECTION_LABELS,
  CONTROLLERS,
  CURRENT_A,
  FAMILIES,
  FamilyDef,
  FREQUENCY_HZ,
  getFamily,
  INSULATING_FLUID,
  MDU_MODELS,
  NAMEPLATE_LANGUAGES,
  OIL_FILTERS,
  PHASES,
  PHASE_LABELS,
  PROTECTIVE_RELAYS,
  REGULATION,
  REGULATION_LABELS,
  SELECTOR_GRADES,
  STANDARDS,
  UM_KV,
} from "./catalog";

export type FieldType = "text" | "number" | "select" | "textarea";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  labelEn: string;
  labelRu: string;
  type: FieldType;
  unit?: string;
  options?: FieldOption[];
  placeholder?: string;
  /** When set, the field only applies to families for which this returns true. */
  appliesTo?: (family: FamilyDef | undefined) => boolean;
}

export interface SectionDef {
  id: string;
  titleEn: string;
  titleRu: string;
  /** Whether the whole section is family-specific. */
  familySpecific?: boolean;
  fields: FieldDef[];
}

function opts(values: readonly (string | number)[], labels?: Record<string, string>): FieldOption[] {
  return values.map((v) => ({
    value: String(v),
    label: labels ? labels[String(v)] ?? String(v) : String(v),
  }));
}

const familyOptions: FieldOption[] = FAMILIES.map((f) => ({
  value: f.code,
  label: f.aliases?.length ? `${f.code} (${f.aliases.join("/")})` : f.code,
}));

export const SECTIONS: SectionDef[] = [
  {
    id: "order",
    titleEn: "Order / contact",
    titleRu: "Заказ / контакт",
    fields: [
      { key: "order_no", labelEn: "Order no.", labelRu: "Номер заказа", type: "text" },
      { key: "order_date", labelEn: "Date", labelRu: "Дата", type: "text", placeholder: "YYYY-MM-DD" },
      { key: "buyer", labelEn: "Buyer / transformer maker", labelRu: "Покупатель / завод", type: "text" },
      { key: "end_user", labelEn: "End user", labelRu: "Конечный пользователь", type: "text" },
      { key: "country", labelEn: "Country", labelRu: "Страна", type: "text" },
      { key: "project", labelEn: "Project", labelRu: "Проект", type: "text" },
      { key: "quantity", labelEn: "Quantity", labelRu: "Количество", type: "number", unit: "pcs" },
      { key: "designer_name", labelEn: "Designer name", labelRu: "Проектировщик", type: "text" },
      { key: "designer_email", labelEn: "Designer email", labelRu: "Эл. почта", type: "text" },
      { key: "designer_phone", labelEn: "Designer phone", labelRu: "Телефон", type: "text" },
      { key: "hm_product_no", labelEn: "Huaming product no.", labelRu: "Номер изделия Huaming", type: "text" },
      { key: "delivery_date", labelEn: "Delivery date", labelRu: "Срок поставки", type: "text", placeholder: "YYYY-MM-DD" },
    ],
  },
  {
    id: "general",
    titleEn: "General data",
    titleRu: "Общие данные",
    fields: [
      { key: "application", labelEn: "Application", labelRu: "Применение", type: "select", options: opts(APPLICATIONS) },
      { key: "phases", labelEn: "Phases", labelRu: "Число фаз", type: "select", options: opts(PHASES, PHASE_LABELS) },
      { key: "frequency_hz", labelEn: "Frequency", labelRu: "Частота", type: "select", unit: "Hz", options: opts(FREQUENCY_HZ) },
      { key: "standard", labelEn: "Standard", labelRu: "Стандарт", type: "select", options: opts(STANDARDS) },
      { key: "ambient_temp_class", labelEn: "Ambient temperature class", labelRu: "Класс темп. окр. среды", type: "text", placeholder: "e.g. -25/+40 °C" },
      { key: "altitude_m", labelEn: "Altitude", labelRu: "Высота над уровнем моря", type: "number", unit: "m" },
      { key: "insulating_fluid", labelEn: "Insulating fluid", labelRu: "Изоляционная жидкость", type: "select", options: opts(INSULATING_FLUID) },
    ],
  },
  {
    id: "range",
    titleEn: "Range (family + drive selection)",
    titleRu: "Комплектация (тип + привод)",
    fields: [
      { key: "family", labelEn: "Tap-changer family", labelRu: "Серия РПН/ПБВ", type: "select", options: familyOptions },
      { key: "mdu_model", labelEn: "Motor drive unit (MDU)", labelRu: "Привод (MDU)", type: "select", options: opts(MDU_MODELS) },
      { key: "controller", labelEn: "Controller", labelRu: "Контроллер", type: "select", options: opts(CONTROLLERS) },
      { key: "oil_filter", labelEn: "Online oil filter", labelRu: "Фильтр масла", type: "select", options: opts(OIL_FILTERS) },
      { key: "protective_relay", labelEn: "Protective relay", labelRu: "Защитное реле", type: "select", options: opts(PROTECTIVE_RELAYS) },
      { key: "rain_cover", labelEn: "Rain cover", labelRu: "Защитный кожух", type: "select", options: opts(["Yes", "No"]) },
    ],
  },
  {
    id: "transformer",
    titleEn: "Transformer data",
    titleRu: "Данные трансформатора",
    fields: [
      { key: "rated_power_kva", labelEn: "Rated power", labelRu: "Номинальная мощность", type: "number", unit: "kVA" },
      { key: "hv_kv", labelEn: "Rated voltage HV", labelRu: "Номинальное напряжение ВН", type: "number", unit: "kV" },
      { key: "lv_kv", labelEn: "Rated voltage LV", labelRu: "Номинальное напряжение НН", type: "number", unit: "kV" },
      { key: "tap_range_pct", labelEn: "Tap range", labelRu: "Диапазон регулирования", type: "text", unit: "%", placeholder: "e.g. ±8×1.25%" },
      { key: "steps", labelEn: "Number of steps (±)", labelRu: "Число ступеней (±)", type: "number" },
      { key: "regulated_winding", labelEn: "Regulated winding & connection", labelRu: "Регулируемая обмотка и соединение", type: "text" },
      { key: "through_current_a", labelEn: "Through-current I", labelRu: "Сквозной ток I", type: "number", unit: "A" },
      { key: "max_current_a", labelEn: "Max current", labelRu: "Макс. ток", type: "number", unit: "A" },
      { key: "step_voltage_v", labelEn: "Step voltage Ust", labelRu: "Ступенчатое напряжение Uст", type: "number", unit: "V" },
      { key: "regulation", labelEn: "Regulation mode", labelRu: "Режим регулирования", type: "select", options: opts(REGULATION, REGULATION_LABELS) },
      { key: "vector_diagram", labelEn: "Winding vector / tap diagram", labelRu: "Векторная схема / схема РПН", type: "text" },
    ],
  },
  {
    id: "oltc",
    titleEn: "On-load tap changer data",
    titleRu: "Данные РПН",
    familySpecific: true,
    fields: [
      { key: "oltc_current_a", labelEn: "Rated through-current Ium", labelRu: "Ном. ток Ium", type: "select", unit: "A", options: opts(CURRENT_A) },
      { key: "oltc_um_kv", labelEn: "Highest voltage Um", labelRu: "Наиб. напряжение Um", type: "select", unit: "kV", options: opts(UM_KV) },
      { key: "oltc_connection", labelEn: "Connection", labelRu: "Соединение", type: "select", options: opts(CONNECTIONS, CONNECTION_LABELS) },
      {
        key: "oltc_selector_grade",
        labelEn: "Selector insulation grade",
        labelRu: "Класс изоляции избирателя",
        type: "select",
        options: opts(SELECTOR_GRADES),
        appliesTo: (fam) => !!fam?.hasSelectorGrade,
      },
      { key: "oltc_tap_pitch", labelEn: "Tap-selector pitch", labelRu: "Шаг избирателя", type: "number" },
      { key: "oltc_tap_positions", labelEn: "Service positions", labelRu: "Рабочие положения", type: "number" },
      { key: "oltc_tap_mid", labelEn: "Mid positions", labelRu: "Средние положения", type: "number" },
      { key: "oltc_ust_max_v", labelEn: "Step voltage max", labelRu: "Uст макс.", type: "number", unit: "V" },
      { key: "oltc_ust_min_v", labelEn: "Step voltage min", labelRu: "Uст мин.", type: "number", unit: "V" },
    ],
  },
  {
    id: "position",
    titleEn: "Range / position definition",
    titleRu: "Определение положений",
    familySpecific: true,
    fields: [
      { key: "pos_max", labelEn: "Max position no.", labelRu: "Макс. положение", type: "number" },
      { key: "pos_mid", labelEn: "Mid position no.", labelRu: "Среднее положение", type: "number" },
      { key: "pos_min", labelEn: "Min position no.", labelRu: "Мин. положение", type: "number" },
      { key: "raise_direction", labelEn: "Raise-voltage direction", labelRu: "Направление повышения", type: "text" },
    ],
  },
  {
    id: "mechanical",
    titleEn: "Mechanical / mounting",
    titleRu: "Механика / монтаж",
    familySpecific: true,
    fields: [
      { key: "flange_type", labelEn: "Mounting flange", labelRu: "Монтажный фланец", type: "select", options: opts(["Tank-top", "Bell (钟罩式)"]) },
      { key: "drive_shaft_horizontal_mm", labelEn: "Horizontal drive-shaft length", labelRu: "Гориз. приводной вал", type: "number", unit: "mm" },
      { key: "drive_shaft_vertical_mm", labelEn: "Vertical drive-shaft length", labelRu: "Вертик. приводной вал", type: "number", unit: "mm" },
      { key: "head_variant", labelEn: "Head variant", labelRu: "Вариант головки", type: "text" },
    ],
  },
  {
    id: "insulation",
    titleEn: "Insulation data",
    titleRu: "Изоляционные данные",
    familySpecific: true,
    fields: [
      { key: "ins_earth_pf_kv", labelEn: "Earth power-frequency withstand", labelRu: "Испыт. напряжение пром. частоты", type: "number", unit: "kV" },
      { key: "ins_earth_li_kv", labelEn: "Earth lightning impulse", labelRu: "Грозовой импульс", type: "number", unit: "kV" },
      { key: "ins_distance_note", labelEn: "Internal distances (a, a1, b, c1, c2, d)", labelRu: "Внутр. расстояния", type: "text" },
    ],
  },
  {
    id: "accessories",
    titleEn: "Accessories / special options",
    titleRu: "Аксессуары / опции",
    fields: [
      { key: "pipe_fittings", labelEn: "Pipe fittings", labelRu: "Патрубки", type: "select", options: opts(["Q", "S", "R", "Standard"]) },
      { key: "pressure_relief", labelEn: "Pressure relief", labelRu: "Сброс давления", type: "select", options: opts(["Burst disc", "PRV"]) },
      { key: "terminal_shields", labelEn: "Terminal shields", labelRu: "Экраны выводов", type: "select", options: opts(["Yes", "No"]) },
      { key: "paint", labelEn: "Paint (RAL)", labelRu: "Окраска (RAL)", type: "text", placeholder: "e.g. RAL 7040" },
      { key: "nameplate_language", labelEn: "Nameplate language", labelRu: "Язык таблички", type: "select", options: opts(NAMEPLATE_LANGUAGES) },
      { key: "oil_sampling", labelEn: "Oil sampling", labelRu: "Отбор проб масла", type: "select", options: opts(["Yes", "No"]) },
    ],
  },
  {
    id: "notes",
    titleEn: "Notes",
    titleRu: "Примечания",
    fields: [
      { key: "notes", labelEn: "Notes (unfilled = standard supply)", labelRu: "Примечания (пусто = станд. комплектация)", type: "textarea" },
    ],
  },
];

export type OrderValues = Record<string, string>;

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
