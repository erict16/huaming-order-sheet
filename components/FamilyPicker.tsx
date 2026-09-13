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
  f: FamilyDef;
  active: boolean;
  onPick: (code: string) => void;
}) {
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
  const cell = (code: string | undefined, key: string) => {
    const f = code ? byCode.get(code) : undefined;
    // empty cells keep the oil/vacuum columns aligned
    if (!f) return <div key={key} />;
    return <Chip key={key} f={f} active={value === code} onPick={onChange} />;
  };
  return (
    <>
      <div className="flex items-center text-sm font-medium text-ink-soft">{label}</div>
      {oilSlots.map((code, i) => cell(code, `o${i}`))}
      {vacSlots.map((code, i) => cell(code, `v${i}`))}
    </>
  );
}

function StackedGroup({
  heading,
  rows,
  byCode,
  value,
  onChange,
}: {
  heading: string;
  rows: { label: string; codes: string[] }[];
  byCode: Map<string, FamilyDef>;
  value: string;
  onChange: (code: string) => void;
}) {
  const visible = rows
    .map((row) => ({
      label: row.label,
      families: row.codes.map((code) => byCode.get(code)).filter((f): f is FamilyDef => !!f),
    }))
    .filter((row) => row.families.length);
  if (!visible.length) return null;
  return (
    <div>
      <h3 className="text-sm font-medium text-ink-soft">{heading}</h3>
      <div className="mt-2 space-y-3">
        {visible.map((row) => (
          <div key={row.label}>
            <p className="mb-1.5 text-xs text-ink-muted">{row.label}</p>
            <div className="flex flex-wrap gap-2">
              {row.families.map((f) => (
                <div key={f.code} className="min-w-[calc(50%-0.25rem)] flex-1">
                  <Chip f={f} active={value === f.code} onPick={onChange} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
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
    const combinedLabel = t(combined, lang);
    const compoundLabel = t(compound, lang);
    const legacyLabel = t(FAMILY_GROUP_LABEL.legacy, lang);
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="space-y-5 md:hidden">
          <StackedGroup
            heading={chromeText("oil", lang)}
            rows={[
              { label: combinedLabel, codes: ["CM", "CMD"] },
              { label: compoundLabel, codes: ["CV", "SV"] },
              { label: legacyLabel, codes: ["SY"] },
            ]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
          <StackedGroup
            heading={chromeText("vacuum", lang)}
            rows={[
              { label: combinedLabel, codes: ["CM2", "SHZV", "SHZVG"] },
              { label: compoundLabel, codes: ["CV2"] },
            ]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="hidden min-w-[36rem] grid-cols-[4.75rem_repeat(2,minmax(0,1fr))_repeat(3,minmax(0,1fr))] items-center gap-2 md:grid">
          <div />
          <div className="col-span-2 text-center text-sm font-medium text-ink-soft">{chromeText("oil", lang)}</div>
          <div className="col-span-3 text-center text-sm font-medium text-ink-soft">{chromeText("vacuum", lang)}</div>
          <SlotRow
            label={combinedLabel}
            oil={["CM", "CMD"]}
            vac={["CM2", "SHZV", "SHZVG"]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
          <SlotRow
            label={compoundLabel}
            oil={["CV", "SV"]}
            vac={["CV2"]}
            byCode={byCode}
            value={value}
            onChange={onChange}
          />
          <SlotRow
            label={legacyLabel}
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
