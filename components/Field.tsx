"use client";

import { useLocale } from "./LocaleProvider";
import { FieldDef, fieldLabel, optionLabel } from "@/lib/schema";

export default function Field({
  field,
  value,
  onChange,
  error,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const { locale } = useLocale();
  const id = `f_${field.key}`;
  const label = fieldLabel(field, locale);
  const placeholder = locale === "zh" ? (field.placeholderZh ?? field.placeholder) : field.placeholder;
  const describedBy = error ? `${id}_err` : undefined;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {field.required ? <span className="ml-0.5 text-red-500">*</span> : null}
        {field.unit ? <span className="ml-1 text-xs font-normal text-slate-400">({field.unit})</span> : null}
      </label>
      {field.type === "select" ? (
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`field-control appearance-none bg-[right_0.75rem_center] bg-no-repeat pr-10 ${error ? "field-control-error" : ""}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {optionLabel(o, locale)}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`field-control resize-y ${error ? "field-control-error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "number" ? "decimal" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`field-control ${error ? "field-control-error" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {error ? (
        <p id={`${id}_err`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
