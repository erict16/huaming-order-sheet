"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { ORDER_PRESETS, type OrderPreset } from "@/lib/presets";
import { useLang } from "@/lib/useLang";

function familyLabel(family: string): string {
  if (family === "CV2") return "CV2 / VCV";
  if (family === "CM2") return "CM2 / VCM";
  return family;
}

export default function PresetPicker({
  onApply,
  sheetId,
}: {
  onApply?: (preset: OrderPreset) => void;
  sheetId?: string;
}) {
  const { lang } = useLang();
  const presets = sheetId ? ORDER_PRESETS.filter((p) => p.sheetId === sheetId) : ORDER_PRESETS;
  if (!presets.length) return null;

  return (
    <details className="group mb-4 rounded-xl border border-slate-200 bg-white">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold text-navy marker:content-none focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel [&::-webkit-details-marker]:hidden">
        <span>{chromeText("presets", lang)}</span>
        <span className="flex items-center gap-2">
          <span className="tabular-nums text-xs font-normal text-ink-muted">{presets.length}</span>
          <ChevronDownIcon className="size-5 text-ink-muted transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
        </span>
      </summary>
      <p className="px-4 pb-2 text-sm text-ink-muted">{chromeText("presetsHint", lang)}</p>
      <ul className="divide-y divide-slate-100 border-t border-slate-100">
        {presets.map((preset) => {
          const body = (
            <>
              <span className="w-[4.75rem] shrink-0 font-mono text-xs font-semibold leading-5 text-navy">
                {familyLabel(preset.family)}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block font-semibold text-navy">{t(preset.title, lang)}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">
                  {t(preset.blurb, lang)}
                </span>
              </span>
              <span className="shrink-0 self-center text-sm font-semibold text-steel">
                {chromeText("presetApply", lang)}
              </span>
            </>
          );
          const cls =
            "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-navy-50 active:translate-y-px focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-steel";
          return (
            <li key={preset.id}>
              {onApply ? (
                <button type="button" onClick={() => onApply(preset)} className={cls}>
                  {body}
                </button>
              ) : (
                <Link href={`/sheet/${preset.sheetId}/?preset=${preset.id}`} className={cls}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
