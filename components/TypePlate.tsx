"use client";

import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function TypePlate({ spaced, compact }: { spaced: string; compact: string }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);
  const text = compact || spaced;

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2744] to-navy text-white shadow-panel">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/90">
          {chromeText("typePlate", lang)}
        </p>
        <button
          type="button"
          onClick={copy}
          disabled={!text}
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/15 disabled:opacity-40"
        >
          <DocumentDuplicateIcon className="h-3.5 w-3.5" />
          {copied ? chromeText("copied", lang) : chromeText("copyType", lang)}
        </button>
      </div>
      <div className="px-4 py-4">
        <p className="font-mono text-lg font-semibold tracking-wide text-amber-50 sm:text-xl">
          {compact || "—"}
        </p>
        {spaced && spaced !== compact ? (
          <p className="mt-1 font-mono text-sm text-white/60">{spaced}</p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed text-white/50">{chromeText("typeHint", lang)}</p>
      </div>
    </div>
  );
}
