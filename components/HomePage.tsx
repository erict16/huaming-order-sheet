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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
        {chromeText("appName", lang)}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">{chromeText("heroLead", lang)}</p>
      <h2 className="mt-8 text-sm font-medium text-ink-soft">
        {chromeText("pickSheet", lang)}
      </h2>
      <ul className="card mt-3 divide-y divide-slate-100 overflow-hidden">
        {SHEETS.map((sheet) => (
          <li key={sheet.id}>
            <Link
              href={`/sheet/${sheet.id}/`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition duration-150 hover:bg-navy-50 active:translate-y-px"
            >
              <div>
                <p className="font-semibold text-navy">{t(sheet.meta.title, lang)}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{t(sheet.meta.tag, lang)}</p>
              </div>
              <span className="text-sm font-semibold text-steel">{chromeText("start", lang)} →</span>
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
