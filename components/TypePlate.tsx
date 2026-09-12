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
    <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
      <p className="font-mono text-lg font-semibold tracking-tight text-navy">{compact}</p>
      <button type="button" className="text-sm text-steel hover:underline" onClick={() => void copy()}>
        {copied ? chromeText("copied", lang) : chromeText("copyType", lang)}
      </button>
    </div>
  );
}
