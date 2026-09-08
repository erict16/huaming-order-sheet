"use client";

import { useLocale } from "./LocaleProvider";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="no-print border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-4 text-xs text-ink-muted sm:px-6">{t("footer")}</div>
    </footer>
  );
}
