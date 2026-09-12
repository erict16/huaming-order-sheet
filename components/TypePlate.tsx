"use client";

import { useState } from "react";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function TypePlate({ compact }: { compact: string; spaced?: string }) {
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
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <p translate="no" className="font-mono text-lg font-semibold tracking-tight text-navy">
        {compact}
      </p>
      <button
        type="button"
        className="inline-flex min-h-10 items-center text-sm font-medium text-steel transition-colors duration-150 hover:text-navy active:translate-y-px focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        onClick={() => void copy()}
        aria-live="polite"
      >
        {copied ? chromeText("copied", lang) : chromeText("copyType", lang)}
      </button>
    </div>
  );
}
