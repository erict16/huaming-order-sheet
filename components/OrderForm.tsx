"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_LABELS,
  FAMILIES,
  getFamily,
} from "@/lib/catalog";
import {
  applicableFields,
  FieldDef,
  OrderValues,
  SECTIONS,
} from "@/lib/schema";
import { buildTapCode, exportExcel } from "@/lib/excel";
import { composeCompact, composeSpaced } from "@/lib/typeString";

const STORAGE_KEY = "hm-order-sheet:v0";

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = `f_${field.key}`;
  const label = (
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
      {field.labelEn}
      <span className="ml-2 text-xs font-normal text-slate-400">{field.labelRu}</span>
      {field.unit ? <span className="ml-1 text-xs text-slate-400">({field.unit})</span> : null}
    </label>
  );
  const cls =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
  return (
    <div>
      {label}
      {field.type === "select" ? (
        <select id={id} className={cls} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea id={id} rows={3} className={cls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : "text"}
          className={cls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      )}
    </div>
  );
}

export default function OrderForm() {
  const [values, setValues] = useState<OrderValues>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setValues(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch {
      /* ignore quota errors */
    }
  }, [values, loaded]);

  const family = values.family ?? "";
  const fam = getFamily(family);

  const set = (key: string) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const typeStr = useMemo(() => {
    if (!family) return { spaced: "", compact: "" };
    const f = {
      family,
      phases: values.phases ?? "",
      currentA: values.oltc_current_a ? Number(values.oltc_current_a) : ("" as const),
      connection: values.oltc_connection ?? "",
      umKv: values.oltc_um_kv ? Number(values.oltc_um_kv) : ("" as const),
      selectorGrade: values.oltc_selector_grade ?? "",
      tapCode: buildTapCode(values),
    };
    return { spaced: composeSpaced(f), compact: composeCompact(f) };
  }, [family, values]);

  const validation = useMemo(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!family) errors.push("Select a tap-changer family (Range section).");
    if (!values.phases) errors.push("Select the number of phases (General data).");
    const pitch = Number(values.oltc_tap_pitch || 0);
    const positions = Number(values.oltc_tap_positions || 0);
    const mid = Number(values.oltc_tap_mid || 0);
    if (pitch && positions && mid) {
      if ((positions - mid) % 2 !== 0) {
        warnings.push("Tap code: (positions − mid) should be even (positions = 2·±steps + mid).");
      }
    }
    if (fam && !fam.modeled) {
      warnings.push(
        `${fam.code} is not fully modeled in v0 (stub). Shared + OLTC fields still export; family-specific tables are pending.`,
      );
    }
    return { errors, warnings };
  }, [family, fam, values]);

  const canExport = validation.errors.length === 0;

  const onExport = () => {
    if (!canExport) return;
    exportExcel(values);
  };

  const onReset = () => {
    if (confirm("Clear all fields?")) setValues({});
  };

  if (!loaded) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-8">
        {SECTIONS.map((section) => {
          const fields = applicableFields(section, family);
          if (fields.length === 0) return null;
          return (
            <section key={section.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-slate-900">
                {section.titleEn}
                <span className="ml-2 text-sm font-normal text-slate-400">{section.titleRu}</span>
              </h2>
              {section.familySpecific ? (
                <p className="mb-4 text-xs text-slate-400">
                  Family-specific · shown for the selected family.
                </p>
              ) : (
                <div className="mb-4" />
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                  <Field key={field.key} field={field} value={values[field.key] ?? ""} onChange={set(field.key)} />
                ))}
              </div>
              {section.id === "range" && family ? (
                <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                  <span className="font-semibold">{fam?.code}</span>
                  {fam?.aliases?.length ? ` (${fam.aliases.join("/")})` : ""} —{" "}
                  <span className="rounded bg-brand/10 px-1.5 py-0.5 font-medium text-brand">
                    {fam ? CATEGORY_LABELS[fam.category] : ""}
                  </span>
                  <span className="ml-2">{fam?.descEn}</span>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      {/* Sticky summary / export panel */}
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Type designation
          </h3>
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs text-slate-400">Spaced (brochure)</p>
              <p className="break-words font-mono text-sm text-slate-900">{typeStr.spaced || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Compact (order sheet)</p>
              <p className="break-words font-mono text-sm text-slate-900">{typeStr.compact || "—"}</p>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <ul className="mt-4 space-y-1 rounded-md bg-red-50 p-3 text-xs text-red-700">
              {validation.errors.map((e) => (
                <li key={e}>• {e}</li>
              ))}
            </ul>
          )}
          {validation.warnings.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
              {validation.warnings.map((w) => (
                <li key={w}>• {w}</li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={onExport}
            disabled={!canExport}
            className="no-print mt-5 w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download Excel (.xlsx)
          </button>
          <div className="no-print mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Print / PDF
            </button>
            <button
              type="button"
              onClick={onReset}
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
          <p className="mt-3 text-[11px] leading-4 text-slate-400">
            Excel includes a human-readable sheet, a flat machine-readable sheet
            (one column per field), and a meta sheet.
          </p>
        </div>

        <p className="mt-3 px-1 text-[11px] leading-4 text-slate-400">
          Autosaved locally in your browser. {FAMILIES.length} families in the
          taxonomy; v0 fully models CMD / CM / CV.
        </p>
      </aside>
    </div>
  );
}
