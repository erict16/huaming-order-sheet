"use client";

import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { allFields, resolveFieldOptions } from "@/lib/schema";
import { useLang } from "@/lib/useLang";
import type { FieldDef, OrderValues, SectionDef, SheetDef } from "@/lib/types";

function groupRows(
  rows: { section: SectionDef; field: FieldDef }[],
): { section: SectionDef; fields: FieldDef[] }[] {
  const groups: { section: SectionDef; fields: FieldDef[] }[] = [];
  for (const { section, field } of rows) {
    const last = groups[groups.length - 1];
    if (!last || last.section.id !== section.id) {
      groups.push({ section, fields: [field] });
    } else {
      last.fields.push(field);
    }
  }
  return groups;
}

export default function ReviewPanel({
  sheet,
  values,
  typeStr,
}: {
  sheet: SheetDef;
  values: OrderValues;
  typeStr?: string;
}) {
  const { lang } = useLang();
  const rows = allFields(sheet, values).map(({ section, field }) => ({
    section,
    field: resolveFieldOptions(field, values),
  }));
  const groups = groupRows(rows);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <h3 className="font-semibold text-navy">{chromeText("reviewTitle", lang)}</h3>
        {typeStr ? (
          <p translate="no" className="mt-1 font-mono text-sm font-medium text-navy">
            {typeStr}
          </p>
        ) : null}
        <p className="mt-1 text-sm text-ink-soft">{chromeText("reviewLead", lang)}</p>
      </div>
      <div className="max-h-[min(32rem,calc(100dvh-18rem))] overflow-auto overscroll-contain">
        {rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-ink-muted">{chromeText("reviewEmpty", lang)}</p>
        ) : null}
        {groups.map(({ section, fields }) => (
          <section key={section.id}>
            <h4 className="sticky top-0 z-[1] border-b border-navy-100 bg-navy-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy">
              {t(section.title, lang)}
            </h4>
            <div className="divide-y divide-slate-100">
              {fields.map((field) => {
                const raw = values[field.key] ?? "";
                const filled = Boolean(String(raw).trim());
                const opt = field.options?.find((o) => o.value === raw);
                const val = opt ? t(opt.label, lang) : raw;
                return (
                  <div
                    key={field.key}
                    className="grid grid-cols-1 gap-0.5 px-4 py-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-3"
                  >
                    <div className="text-sm text-ink-soft">{t(field.label, lang)}</div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`mt-1 size-1.5 shrink-0 rounded-full ${filled ? "bg-navy" : "bg-slate-300"}`}
                        aria-hidden="true"
                      />
                      <div className={`min-w-0 text-sm ${filled ? "font-medium text-ink" : "text-ink-muted"}`}>
                        {filled ? val : chromeText("standardNote", lang)}
                        {filled && field.unit ? (
                          <span className="ml-1 font-normal text-ink-muted">{field.unit}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
