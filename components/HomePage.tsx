"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { SHEETS } from "@/lib/schema";
import { useLang } from "@/lib/useLang";

export default function HomePage() {
  const { lang } = useLang();

  return (
    <AppBody>
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-steel">
          {chromeText("heroEyebrow", lang)}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-navy sm:text-5xl">
          {chromeText("heroTitle", lang)}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {chromeText("heroLead", lang)}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {chromeText("pickSheet", lang)}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SHEETS.map((sheet, i) => (
            <Link
              key={sheet.id}
              href={`/sheet/${sheet.id}/`}
              className={`group card relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-panel ${
                i === 0 ? "md:col-span-2 md:p-8" : ""
              }`}
            >
              <div
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ background: sheet.meta.accent }}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="badge bg-navy/8 text-navy">{t(sheet.meta.tag, lang)}</span>
                  <h3 className={`mt-3 font-bold text-navy ${i === 0 ? "text-2xl" : "text-xl"}`}>
                    {t(sheet.meta.title, lang)}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {t(sheet.meta.summary, lang)}
                  </p>
                </div>
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white transition group-hover:bg-navy-800">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-5 text-sm font-semibold text-steel">
                {chromeText("start", lang)} →
              </p>
            </Link>
          ))}
        </div>
      </section>
    </AppBody>
  );
}

function AppBody({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
