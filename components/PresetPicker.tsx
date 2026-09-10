"use client";

import Link from "next/link";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { ORDER_PRESETS, type OrderPreset } from "@/lib/presets";
import { useLang } from "@/lib/useLang";

export default function PresetPicker({
  onApply,
}: {
  onApply?: (preset: OrderPreset) => void;
}) {
  const { lang } = useLang();

  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {chromeText("presets", lang)}
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {ORDER_PRESETS.map((preset) => {
          const body = (
            <>
              <p className="font-semibold text-navy">{t(preset.title, lang)}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{t(preset.blurb, lang)}</p>
              <p className="mt-2 text-sm font-semibold text-steel">
                {chromeText("presetApply", lang)} →
              </p>
            </>
          );
          return (
            <li key={preset.id}>
              {onApply ? (
                <button
                  type="button"
                  onClick={() => onApply(preset)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99]"
                >
                  {body}
                </button>
              ) : (
                <Link
                  href={`/sheet/${preset.sheetId}/?preset=${preset.id}`}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99]"
                >
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
