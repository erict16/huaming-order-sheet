"use client";

import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { allFields } from "@/lib/schema";
import { useLang } from "@/lib/useLang";
import type { OrderValues, SheetDef } from "@/lib/types";

export default function ReviewPanel({ sheet, values }: { sheet: SheetDef; values: OrderValues }) {
  const { lang } = useLang();
  const rows = allFields(sheet, values);
  let last = "";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="font-semibold text-navy">{chromeText("reviewTitle", lang)}</h3>
        <p className="mt-1 text-sm text-ink-soft">{chromeText("reviewLead", lang)}</p>
      </div>
      <div className="divide-y divide-slate-100">
        {rows.map(({ section, field }) => {
          const showHead = section.id !== last;
          last = section.id;
          const val = values[field.key] ?? "";
          return (
            <div key={field.key}>
              {showHead ? (
                <div className="bg-navy/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-navy">
                  {t(section.title, lang)}
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-2">
                <div className="text-sm text-ink-soft">{t(field.label, lang)}</div>
                <div className={`text-sm ${val ? "font-medium text-ink" : "text-ink-muted"}`}>
                  {val || chromeText("standardNote", lang)}
                  {val && field.unit ? <span className="ml-1 text-ink-muted">{field.unit}</span> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
