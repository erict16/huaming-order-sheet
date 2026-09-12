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
    <div className="card divide-y divide-slate-100">
      {[...groups.entries()].map(([cat, list]) => {
        const quiet = cat === "legacy";
        return (
          <div key={cat} className={`p-4 sm:p-5 ${quiet ? "bg-slate-50/80" : ""}`}>
            <h3 className="mb-3 text-sm font-medium text-ink-soft">
              {t(FAMILY_GROUP_LABEL[cat as keyof typeof FAMILY_GROUP_LABEL], lang)}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {list.map((f) => {
                const active = value === f.code;
                return (
                  <button
                    key={f.code}
                    type="button"
                    onClick={() => onChange(f.code)}
                    className={`flex min-h-[4.25rem] flex-col items-start justify-center rounded-xl px-3 py-2.5 text-left transition duration-150 active:translate-y-px ${
                      active
                        ? "bg-navy-50 text-navy ring-2 ring-navy"
                        : "bg-white text-navy ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="font-mono text-[15px] font-semibold tracking-tight">{f.code}</span>
                    {f.aliases?.[0] ? (
                      <span className={`mt-0.5 text-xs ${active ? "text-navy/70" : "text-ink-muted"}`}>
                        {f.aliases[0]}
                      </span>
                    ) : (
                      <span className="mt-0.5 text-xs text-transparent">·</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
