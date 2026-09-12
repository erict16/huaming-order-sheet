"use client";

import { L, t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { FamilyDef } from "@/lib/types";
import { FAMILY_GROUP_LABEL } from "@/lib/catalog";

function Chip({
  f,
  active,
  onPick,
}: {
  f: FamilyDef | undefined;
  active: boolean;
  onPick: (code: string) => void;
}) {
  if (!f) return <div />;
  return (
    <button
      type="button"
      onClick={() => onPick(f.code)}
      aria-pressed={active}
      className={`flex h-11 w-full items-center justify-center gap-1 rounded-lg font-mono text-sm font-semibold tracking-tight transition-colors duration-150 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2 ${
        active ? "bg-navy text-white" : "bg-white text-navy ring-1 ring-slate-200 [@media(hover:hover)]:hover:ring-navy/40"
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

function SlotRow({
  label,
  oil,
  vac,
  byCode,
  value,
  onChange,
}: {
  label: string;
  oil: string[];
  vac: string[];
  byCode: Map<string, FamilyDef>;
  value: string;
  onChange: (code: string) => void;
}) {
  const oilSlots = [oil[0], oil[1]];
  const vacSlots = [vac[0], vac[1], vac[2]];
  return (
    <>
      <div className="flex items-center text-sm font-medium text-ink-soft">{label}</div>
      {oilSlots.map((code, i) => (
        <Chip key={`o${i}`} f={code ? byCode.get(code) : undefined} active={!!code && value === code} onPick={onChange} />
      ))}
      {vacSlots.map((code, i) => (
        <Chip key={`v${i}`} f={code ? byCode.get(code) : undefined} active={!!code && value === code} onPick={onChange} />
      ))}
    </>
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
    const combined = L("组合式", "Combined", "Комбинированный", "Tổ hợp");
    const compound = L("复合式", "Compound", "Составной", "Compound");
    return (
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid min-w-[36rem] grid-cols-[4.75rem_repeat(2,minmax(0,1fr))_repeat(3,minmax(0,1fr))] items-center gap-2">
          <div />
          <div className="col-span-2 text-center text-sm font-medium text-ink-soft">{chromeText("oil", lang)}</div>
          <div className="col-span-3 text-center text-sm font-medium text-ink-soft">{chromeText("vacuum", lang)}</div>
          <SlotRow
            label={t(combined, lang)}
            oil={["CM", "CMD"]}
            vac={["CM2", "SHZV", "SHZVG"]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
          <SlotRow
            label={t(compound, lang)}
            oil={["CV", "SV"]}
            vac={["CV2"]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
          <SlotRow
            label={t(FAMILY_GROUP_LABEL.legacy, lang)}
            oil={["SY"]}
            vac={[]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
        </div>
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
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {list.map((f) => (
              <Chip key={f.code} f={f} active={value === f.code} onPick={onChange} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
