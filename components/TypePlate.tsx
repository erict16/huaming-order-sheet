"use client";

import { useState } from "react";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function TypePlate({ compact, spaced }: { compact: string; spaced?: string }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  if (!compact) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(compact);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-navy/[0.04] px-4 py-3 ring-1 ring-navy/10">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {chromeText("typePlate", lang)}
        </p>
        <p className="mt-0.5 break-all font-mono text-base font-semibold tracking-tight text-navy">{compact}</p>
        {spaced && spaced !== compact ? (
          <p className="mt-0.5 font-mono text-xs text-ink-muted">{spaced}</p>
        ) : null}
      </div>
      <button type="button" className="btn-secondary shrink-0 px-3 py-1.5 text-xs" onClick={() => void copy()}>
        {copied ? chromeText("copied", lang) : chromeText("copyType", lang)}
      </button>
    </div>
  );
}
