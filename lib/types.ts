export type Lang = "zh" | "en" | "ru" | "vi";

export type SheetId = "oltc" | "octc" | "dry" | "cma7" | "shm-d";

export type PhaseCode = "I" | "II" | "III";
export type Connection = "Y" | "D";
export type Regulation = "linear" | "reversing" | "coarse_fine";
export type ChangeOver = "0" | "W" | "G";
export type SelectorSize = "B" | "C" | "D" | "DE";

export type OrderValues = Record<string, string>;

export type I18nText = Record<Lang, string>;

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "combobox"
  | "radio"
  | "textarea"
  | "date";

export interface FieldOption {
  value: string;
  label: I18nText;
}

export interface FieldDef {
  key: string;
  label: I18nText;
  hint?: I18nText;
  type: FieldType;
  unit?: string;
  options?: FieldOption[];
  placeholder?: I18nText;
  required?: boolean;
  span?: 1 | 2;
  applies?: (values: OrderValues) => boolean;
}

export interface SectionDef {
  id: string;
  title: I18nText;
  hint?: I18nText;
  fields: FieldDef[];
}

export interface StepDef {
  id: string;
  title: I18nText;
  blurb: I18nText;
  kind?: "family" | "form" | "review";
  sections: SectionDef[];
}

export type FamilyCategory =
  | "oil_combined"
  | "oil_compound"
  | "vacuum_combined"
  | "vacuum_compound"
  | "external"
  | "legacy"
  | "dry"
  | "octc_cage"
  | "octc_drum";

export interface FamilyDef {
  code: string;
  aliases?: string[];
  category: FamilyCategory;
  hasSelectorGrade: boolean;
  structure: "combined" | "compound";
  vacuum: boolean;
  currents: Partial<Record<PhaseCode, number[]>>;
  umKv: number[];
  desc: I18nText;
}

export interface SheetMeta {
  id: SheetId;
  title: I18nText;
  short: I18nText;
  tag: I18nText;
  summary: I18nText;
  accent: string;
}

export interface SheetDef {
  id: SheetId;
  meta: SheetMeta;
  families?: FamilyDef[];
  steps: StepDef[];
}
