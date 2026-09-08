"use client";

import { t } from "@/lib/copy";
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
    <div className="space-y-5">
      {[...groups.entries()].map(([cat, list]) => (
        <div key={cat}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
            {t(FAMILY_GROUP_LABEL[cat as keyof typeof FAMILY_GROUP_LABEL], lang)}
          </h3>
          <div className="flex flex-wrap gap-2">
            {list.map((f) => {
              const active = value === f.code;
              return (
                <button
                  key={f.code}
                  type="button"
                  onClick={() => onChange(f.code)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition active:scale-[0.98] ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-slate-200 bg-white text-navy hover:border-slate-400"
                  }`}
                >
                  {f.code}
                  {f.aliases?.[0] ? (
                    <span className={`ml-1.5 font-normal ${active ? "text-white/70" : "text-ink-muted"}`}>
                      {f.aliases[0]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
