"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { ORDER_PRESETS, type OrderPreset } from "@/lib/presets";
import { useLang } from "@/lib/useLang";

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
    <details className="mb-4 rounded-lg border border-slate-200 bg-white">
      <summary className="cursor-pointer list-none px-5 py-3 text-sm font-semibold text-navy marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-3">
          <span>{chromeText("presets", lang)}</span>
          <span className="text-xs font-normal text-ink-muted">{presets.length}</span>
        </span>
      </summary>
      <p className="px-5 pb-2 text-sm text-ink-muted">{chromeText("presetsHint", lang)}</p>
      <ul className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
        {presets.map((preset) => {
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center rounded-md bg-navy/10 px-2 py-0.5 text-xs font-semibold text-navy ring-1 ring-inset ring-navy/15">
                  {preset.family}
                  {preset.family === "CV2" ? " / VCV" : preset.family === "CM2" ? " / VCM" : ""}
                </span>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-steel/10 text-steel">
                  <ArrowRightIcon className="size-4" />
                </span>
              </div>
              <p className="mt-2 font-semibold text-navy">{t(preset.title, lang)}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{t(preset.blurb, lang)}</p>
              <p className="mt-3 text-sm font-semibold text-steel">{chromeText("presetApply", lang)}</p>
            </>
          );
          const cls =
            "block h-full w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-card hover:ring-steel/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel";
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
