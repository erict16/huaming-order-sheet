"use client";

import { useLocale } from "./LocaleProvider";

export default function Header() {
  const { locale, setLocale, t } = useLocale();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-navy text-white">
            <span className="text-sm font-bold leading-none">HM</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-ink">{t("appTitle")}</p>
            <p className="text-[11px] text-ink-muted">{t("brandSub")}</p>
          </div>
        </div>

        <div className="ml-auto inline-flex rounded-full border border-slate-200 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setLocale("zh")}
            className={`rounded-full px-2.5 py-1 ${locale === "zh" ? "bg-navy text-white" : "text-ink-muted"}`}
            aria-pressed={locale === "zh"}
          >
            中文
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`rounded-full px-2.5 py-1 ${locale === "en" ? "bg-navy text-white" : "text-ink-muted"}`}
            aria-pressed={locale === "en"}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
