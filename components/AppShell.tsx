"use client";

import Link from "next/link";
import { LANGS } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

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
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 text-navy backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-50 ring-1 ring-navy/15">
              <span className="text-sm font-black leading-none tracking-tighter text-navy">HM</span>
            </div>
            <div className="leading-tight">
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
              className="ml-1 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy ring-1 ring-navy/10 hover:bg-navy-100"
            >
              {chromeText("backHome", lang)}
            </Link>
          ) : null}

          <div className="ml-auto flex items-center gap-0.5 rounded-full bg-slate-100 p-0.5 ring-1 ring-slate-200/80">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition duration-150 active:translate-y-px ${
                  lang === l.id ? "bg-white text-navy shadow-sm" : "text-ink-muted hover:text-navy"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          {chromeText("footer", lang)}
        </div>
      </footer>
    </div>
  );
}
