"use client";

import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { FieldDef, Lang } from "@/lib/types";
import Combobox from "./Combobox";
import SelectListbox from "./SelectListbox";

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
              className={`rounded-lg px-3.5 py-2.5 text-[15px] shadow-sm ring-1 ring-inset transition duration-150 active:translate-y-px ${
                active
                  ? "bg-navy text-white ring-navy"
                  : "bg-white text-ink-soft ring-slate-300 hover:ring-slate-400"
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
        allowCustom={field.key === "designer_phone_cc"}
      />
    );
  }

  if (field.type === "select") {
    return (
      <SelectListbox
        options={field.options ?? []}
        value={value}
        onChange={onChange}
        lang={lang}
      />
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

  if (field.type === "date") {
    return (
      <div className="relative">
        <input
          className="field-control pr-10"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => {
            const el = e.currentTarget;
            if (typeof el.showPicker === "function") el.showPicker();
          }}
        />
        <CalendarDaysIcon className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
      </div>
    );
  }

  const input = (
    <input
      className={`field-control ${field.prefix ? "pl-8" : ""}`}
      type={field.type === "number" ? "number" : "text"}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
  if (!field.prefix) return input;
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-ink-muted">
        {field.prefix}
      </span>
      {input}
    </div>
  );
}
