"use client";

import { useLocale } from "./LocaleProvider";

export default function HomeIntro() {
  const { t } = useLocale();
  return (
    <div className="mb-6">
      <p className="text-xs font-medium text-steel">{t("pageKicker")}</p>
      <h1 className="mt-1 text-2xl font-semibold text-navy">{t("pageTitle")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">{t("pageBlurb")}</p>
    </div>
  );
}
