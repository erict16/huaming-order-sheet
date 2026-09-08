import type { I18nText, Lang } from "./types";

export const LANGS: { id: Lang; label: string }[] = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
  { id: "vi", label: "Tiếng Việt" },
];

export function L(zh: string, en: string, ru: string, vi: string): I18nText {
  return { zh, en, ru, vi };
}

export function t(text: I18nText, lang: Lang): string {
  return text[lang] || text.zh || text.en;
}

export function opt(
  value: string,
  zh: string,
  en = zh,
  ru = en,
  vi = en,
): { value: string; label: I18nText } {
  return { value, label: L(zh, en, ru, vi) };
}
