"use client";

import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { FamilyDef } from "@/lib/types";
import { FAMILY_GROUP_LABEL } from "@/lib/catalog";

export default function FamilyPicker({
  families,
  value,
  onChange,
}: {
  families: FamilyDef[];
  value: string;
  onChange: (code: string) => void;
}) {
  const { lang } = useLang();
  const groups = new Map<string, FamilyDef[]>();
  for (const f of families) {
    const list = groups.get(f.category) ?? [];
    list.push(f);
    groups.set(f.category, list);
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-ink-soft">{chromeText("familyPick", lang)}</p>
      {[...groups.entries()].map(([cat, list]) => (
        <div key={cat}>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {t(FAMILY_GROUP_LABEL[cat as keyof typeof FAMILY_GROUP_LABEL], lang)}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((f) => {
              const active = value === f.code;
              return (
                <button
                  key={f.code}
                  type="button"
                  onClick={() => onChange(f.code)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-navy bg-navy/5 ring-2 ring-navy/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-navy">{f.code}</span>
                    {f.aliases?.length ? (
                      <span className="text-xs text-ink-muted">{f.aliases.join(" / ")}</span>
                    ) : null}
                    {f.vacuum ? (
                      <span className="badge bg-steel/10 text-steel">vacuum</span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t(f.desc, lang)}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
