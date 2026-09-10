"use client";

import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { FieldDef, Lang } from "@/lib/types";
import Combobox from "./Combobox";

export default function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const { lang } = useLang();
  const label = t(field.label, lang);
  const hint = field.hint ? t(field.hint, lang) : "";
  const ph = field.placeholder ? t(field.placeholder, lang) : "";
  const span = field.span === 2 ? "sm:col-span-2" : "";

  return (
    <div className={`block ${span}`}>
      <span className="field-label">
        {label}
        {field.unit ? <span className="ml-1 font-normal text-ink-muted">({field.unit})</span> : null}
        {field.required ? (
          <span className="ml-1 text-xs font-semibold text-rose-600">{chromeText("required", lang)}</span>
        ) : null}
      </span>
      <Control field={field} value={value} onChange={onChange} placeholder={ph} lang={lang} />
      {hint ? <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">{hint}</span> : null}
    </div>
  );
}

function Control({
  field,
  value,
  onChange,
  placeholder,
  lang,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  lang: Lang;
}) {
  if (field.type === "radio" && field.options) {
    return (
      <div className="flex flex-wrap gap-2">
        {field.options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                active
                  ? "border-navy bg-navy text-white"
                  : "border-slate-300 bg-white text-ink-soft hover:border-slate-400"
              }`}
            >
              {t(opt.label, lang)}
            </button>
          );
        })}
      </div>
    );
  }

  if (field.type === "combobox") {
    return (
      <Combobox
        options={field.options ?? []}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        lang={lang}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select className="field-control" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {t(opt.label, lang)}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        className="field-control min-h-28"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      className="field-control"
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
