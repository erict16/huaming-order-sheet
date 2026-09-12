"use client";

import { L, t } from "@/lib/copy";
import { useLang } from "@/lib/useLang";
import type { FamilyDef } from "@/lib/types";
import { FAMILY_GROUP_LABEL } from "@/lib/catalog";

function Cell({
  f,
  active,
  onPick,
}: {
  f: FamilyDef;
  active: boolean;
  onPick: (code: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(f.code)}
      className={`inline-flex h-11 items-center gap-1.5 rounded-md px-3 font-mono text-[15px] font-semibold tracking-tight transition duration-150 active:translate-y-px ${
        active
          ? "bg-navy text-white"
          : "bg-white text-navy ring-1 ring-slate-200 hover:ring-navy/40"
      }`}
    >
      {f.code}
      {f.aliases?.[0] ? (
        <span className={`font-sans text-[11px] font-normal ${active ? "text-white/70" : "text-ink-muted"}`}>
          {f.aliases[0]}
        </span>
      ) : null}
    </button>
  );
}

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
  const byCode = new Map(families.map((f) => [f.code, f]));
  const catalog =
    families.some((f) => f.category.startsWith("oil")) &&
    families.some((f) => f.category.startsWith("vacuum"));

  if (catalog) {
    const rows: { label: ReturnType<typeof L>; oil: string[]; vac: string[] }[] = [
      { label: L("组合式", "Combined", "Комбинированный", "Tổ hợp"), oil: ["CM", "CMD"], vac: ["CM2", "SHZV", "SHZVG"] },
      { label: L("复合式", "Compound", "Составной", "Compound"), oil: ["CV", "SV"], vac: ["CV2"] },
    ];
    const legacy = families.filter((f) => f.category === "legacy");

    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-ink-soft">
              <th className="w-24 px-4 py-3 text-center font-medium" />
              <th className="px-3 py-3 text-center font-medium">{lang === "en" ? "Oil" : "油浸"}</th>
              <th className="px-3 py-3 text-center font-medium">{lang === "en" ? "Vacuum" : "真空"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label.zh} className="border-t border-slate-100">
                <th className="px-4 py-3 text-center font-medium text-ink-soft">{t(row.label, lang)}</th>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    {row.oil.map((code) => {
                      const f = byCode.get(code);
                      return f ? <Cell key={code} f={f} active={value === code} onPick={onChange} /> : null;
                    })}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    {row.vac.map((code) => {
                      const f = byCode.get(code);
                      return f ? <Cell key={code} f={f} active={value === code} onPick={onChange} /> : null;
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {legacy.length ? (
              <tr className="border-t border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-center font-medium text-ink-muted">{t(FAMILY_GROUP_LABEL.legacy, lang)}</th>
                <td className="px-3 py-3" colSpan={2}>
                  <div className="flex flex-wrap justify-center gap-2">
                    {legacy.map((f) => (
                      <Cell key={f.code} f={f} active={value === f.code} onPick={onChange} />
                    ))}
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    );
  }

  const groups = new Map<string, FamilyDef[]>();
  for (const f of families) {
    const list = groups.get(f.category) ?? [];
    list.push(f);
    groups.set(f.category, list);
  }

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      {[...groups.entries()].map(([cat, list]) => (
        <div key={cat}>
          <h3 className="mb-2 text-sm font-medium text-ink-soft">
            {t(FAMILY_GROUP_LABEL[cat as keyof typeof FAMILY_GROUP_LABEL], lang)}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {list.map((f) => (
              <Cell key={f.code} f={f} active={value === f.code} onPick={onChange} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
