"use client";

import Link from "next/link";
import { Radio, RadioGroup } from "@headlessui/react";
import { LANGS } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { Lang } from "@/lib/types";

export default function AppShell({
  children,
  back,
}: {
  children: React.ReactNode;
  back?: boolean;
}) {
  const { lang, setLang } = useLang();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="absolute left-4 top-3 z-50 -translate-y-[160%] rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white outline-none transition-transform duration-150 focus:translate-y-0 focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2"
      >
        {chromeText("skipToContent", lang)}
      </a>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white text-navy">
        <div className="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/"
              className="flex min-h-10 min-w-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy-50 ring-1 ring-navy/15">
                <span className="text-sm font-black leading-none tracking-tighter text-navy">HM</span>
              </div>
              <div className="min-w-0 leading-tight">
                <p className="text-sm font-semibold tracking-wide">
                  {chromeText("brand", lang)}{" "}
                  <span className="font-normal text-ink-muted">{chromeText("brandSub", lang)}</span>
                </p>
                <p className="text-[11px] text-ink-muted">{chromeText("appNameShort", lang)}</p>
              </div>
            </Link>

            {back ? (
              <Link
                href="/"
                className="inline-flex min-h-10 items-center rounded-md bg-navy-50 px-3 text-xs font-medium text-navy ring-1 ring-navy/10 transition-colors duration-150 hover:bg-navy-100 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2"
              >
                {chromeText("backHome", lang)}
              </Link>
            ) : null}
          </div>

          <RadioGroup
            value={lang}
            onChange={(next: Lang) => setLang(next)}
            aria-label={chromeText("langSwitch", lang)}
            className="flex w-full items-center gap-0.5 rounded-lg bg-slate-100 p-0.5 ring-1 ring-slate-200 sm:ml-auto sm:w-auto"
          >
            {LANGS.map((l) => (
              <Radio
                key={l.id}
                value={l.id}
                className="inline-flex min-h-10 min-w-0 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-1.5 text-xs font-semibold text-ink-muted transition-colors duration-150 active:translate-y-px data-[checked]:bg-white data-[checked]:text-navy data-[checked]:shadow-sm data-[hover]:text-navy focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-steel sm:min-w-10 sm:flex-none sm:px-2.5"
              >
                {l.label}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 scroll-mt-16 outline-none">
        {children}
      </main>
      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          {chromeText("footer", lang)}
        </div>
      </footer>
    </div>
  );
}
