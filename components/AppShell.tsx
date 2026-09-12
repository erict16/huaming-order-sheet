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
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20">
              <span className="text-lg font-black leading-none tracking-tighter">HM</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-wide">
                {chromeText("brand", lang)}{" "}
                <span className="font-normal text-white/70">{chromeText("brandSub", lang)}</span>
              </p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
                {chromeText("appNameShort", lang)}
              </p>
            </div>
          </Link>

          {back ? (
            <Link
              href="/"
              className="ml-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15 hover:bg-white/15"
            >
              {chromeText("backHome", lang)}
            </Link>
          ) : null}

          <div className="ml-auto flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15">
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLang(l.id)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  lang === l.id ? "bg-white text-navy shadow-sm" : "text-white/75 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="no-print border-t border-slate-200 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-muted sm:px-6">
          {chromeText("footer", lang)}
        </div>
      </footer>
    </div>
  );
}
