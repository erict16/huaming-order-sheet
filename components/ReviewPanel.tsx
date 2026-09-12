"use client";

import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { allFields, resolveFieldOptions } from "@/lib/schema";
import { useLang } from "@/lib/useLang";
import type { OrderValues, SheetDef } from "@/lib/types";

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
  let last = "";

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
      <div>
        {rows.map(({ section, field }) => {
          const showHead = section.id !== last;
          last = section.id;
          const raw = values[field.key] ?? "";
          const filled = Boolean(String(raw).trim());
          const opt = field.options?.find((o) => o.value === raw);
          const val = opt ? t(opt.label, lang) : raw;
          return (
            <div key={field.key}>
              {showHead ? (
                <div className="bg-navy-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy">
                  {t(section.title, lang)}
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-1 border-t border-slate-100 px-4 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-baseline">
                <div className="text-sm text-ink-soft">{t(field.label, lang)}</div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${filled ? "bg-navy" : "bg-slate-300"}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`min-w-0 text-sm ${filled ? "font-medium text-ink" : "text-ink-muted"}`}
                  >
                    {filled ? val : chromeText("standardNote", lang)}
                    {filled && field.unit ? (
                      <span className="ml-1 font-normal text-ink-muted">{field.unit}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
