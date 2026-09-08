"use client";

import { FieldDef } from "@/lib/schema";

export default function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `f_${field.key}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {field.labelEn}
        <span className="ml-2 text-xs font-normal text-ink-muted">{field.labelRu}</span>
        {field.unit ? <span className="ml-1 text-xs text-slate-400">({field.unit})</span> : null}
      </label>
      {field.type === "select" ? (
        <select
          id={id}
          className="field-control appearance-none bg-[right_0.75rem_center] bg-no-repeat pr-10"
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
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          id={id}
          rows={3}
          className="field-control resize-y"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "number" ? "decimal" : undefined}
          className="field-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  );
}
