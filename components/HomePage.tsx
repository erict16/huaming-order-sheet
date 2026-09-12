"use client";

import Link from "next/link";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { SHEETS } from "@/lib/schema";
import { useLang } from "@/lib/useLang";
import PresetPicker from "./PresetPicker";

export default function HomePage() {
  const { lang } = useLang();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-balance text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
        {chromeText("appName", lang)}
      </h1>
      <p className="mt-2 max-w-prose text-pretty text-sm text-ink-soft">{chromeText("heroLead", lang)}</p>
      <h2 className="mt-8 text-sm font-medium text-ink-soft">{chromeText("pickSheet", lang)}</h2>
      <ul className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {SHEETS.map((sheet) => (
          <li key={sheet.id} className="border-t border-slate-100 first:border-t-0">
            <Link
              href={`/sheet/${sheet.id}/`}
              className="flex min-h-16 items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-navy-50 active:translate-y-px focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-steel"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold text-steel">{t(sheet.meta.short, lang)}</p>
                <p className="font-semibold text-navy">{t(sheet.meta.title, lang)}</p>
                <p className="text-sm text-ink-muted">{t(sheet.meta.tag, lang)}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-steel">{chromeText("start", lang)}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <PresetPicker />
      </div>
    </div>
  );
}
