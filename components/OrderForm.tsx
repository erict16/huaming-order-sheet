"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_LABELS, getFamily } from "@/lib/catalog";
import {
  allApplicableFields,
  applicableFields,
  OrderValues,
  SECTIONS,
} from "@/lib/schema";
import { buildTapCode, exportExcel } from "@/lib/excel";
import { composeCompact, composeSpaced } from "@/lib/typeString";
import FamilyPicker from "./FamilyPicker";
import Field from "./Field";
import Stepper from "./Stepper";

const STORAGE_KEY = "hm-order-sheet:v0";

interface WizardStep {
  id: string;
  title: string;
  blurb: string;
  sections: string[];
  kind?: "product" | "review";
}

const STEPS: WizardStep[] = [
  { id: "product", title: "Product", blurb: "Choose the tap-changer family and drive package.", sections: ["range"], kind: "product" },
  { id: "order", title: "Order & general", blurb: "Order contacts and general operating data.", sections: ["order", "general"] },
  { id: "transformer", title: "Transformer", blurb: "Electrical data of the transformer.", sections: ["transformer"] },
  { id: "oltc", title: "Tap changer", blurb: "Tap-changer rating and position definition.", sections: ["oltc", "position"] },
  { id: "construction", title: "Construction", blurb: "Mechanical, insulation and accessory options.", sections: ["mechanical", "insulation", "accessories", "notes"] },
  { id: "review", title: "Review & export", blurb: "Check every value, then export the Excel.", sections: [], kind: "review" },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
};

export default function OrderForm() {
  const [values, setValues] = useState<OrderValues>({});
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

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
      /* ignore quota */
    }
  }, [values, loaded]);

  const family = values.family ?? "";
  const fam = getFamily(family);
  const set = (key: string) => (v: string) => setValues((prev) => ({ ...prev, [key]: v }));

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
    if (!family) errors.push("Select a tap-changer family (Product step).");
    if (!values.phases) errors.push("Select the number of phases (Order & general step).");
    const pitch = Number(values.oltc_tap_pitch || 0);
    const positions = Number(values.oltc_tap_positions || 0);
    const mid = Number(values.oltc_tap_mid || 0);
    if (pitch && positions && mid && (positions - mid) % 2 !== 0) {
      warnings.push("Tap code: (positions − mid) should be even.");
    }
    if (fam && !fam.modeled) {
      warnings.push(`${fam.code} is a v0 stub — shared + OLTC fields still export.`);
    }
    return { errors, warnings };
  }, [family, fam, values]);

  const canExport = validation.errors.length === 0;

  const go = (i: number) => {
    setDir(i > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onExport = () => {
    if (!canExport) return;
    exportExcel(values);
    setToast("Excel downloaded ✓");
    window.setTimeout(() => setToast(null), 2600);
  };

  const onReset = () => {
    if (confirm("Clear all fields?")) {
      setValues({});
      go(0);
    }
  };

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/60" />;
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <Stepper steps={STEPS} current={step} onGo={go} />

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
            <h2 className="text-lg font-bold text-navy">{current.title}</h2>
            <p className="mt-0.5 text-sm text-ink-muted">{current.blurb}</p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current.id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                {current.kind === "product" ? (
                  <ProductStep family={family} values={values} set={set} setFamily={set("family")} fam={fam} />
                ) : current.kind === "review" ? (
                  <ReviewStep values={values} family={family} typeCompact={typeStr.compact} />
                ) : (
                  <StepSections sectionIds={current.sections} family={family} values={values} set={set} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop nav */}
          <div className="no-print hidden items-center justify-between border-t border-slate-100 px-5 py-4 sm:px-6 md:flex">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-secondary disabled:opacity-40">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onReset} className="btn-secondary">
                Reset
              </button>
              {isLast ? (
                <button type="button" onClick={onExport} disabled={!canExport} className="btn-primary">
                  Download Excel (.xlsx)
                </button>
              ) : (
                <button type="button" onClick={() => go(step + 1)} className="btn-primary">
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop summary aside */}
      <aside className="no-print hidden lg:block">
        <div className="lg:sticky lg:top-20">
          <SummaryPanel
            spaced={typeStr.spaced}
            compact={typeStr.compact}
            errors={validation.errors}
            warnings={validation.warnings}
            fam={fam}
            canExport={canExport}
            onExport={onExport}
          />
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.2)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-secondary flex-1 disabled:opacity-40">
            ← Back
          </button>
          {typeStr.compact ? (
            <span className="hidden max-w-[38%] truncate font-mono text-[11px] text-ink-muted min-[430px]:block">
              {typeStr.compact}
            </span>
          ) : null}
          {isLast ? (
            <button type="button" onClick={onExport} disabled={!canExport} className="btn-primary flex-1">
              Download .xlsx
            </button>
          ) : (
            <button type="button" onClick={() => go(step + 1)} className="btn-primary flex-1">
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="no-print fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-panel md:bottom-6"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SectionGrid({
  sectionId,
  family,
  values,
  set,
  excludeKeys = [],
}: {
  sectionId: string;
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
  excludeKeys?: string[];
}) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;
  const fields = applicableFields(section, family).filter((f) => !excludeKeys.includes(f.key));
  if (fields.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
      {fields.map((field) => (
        <Field key={field.key} field={field} value={values[field.key] ?? ""} onChange={set(field.key)} />
      ))}
    </div>
  );
}

function StepSections({
  sectionIds,
  family,
  values,
  set,
}: {
  sectionIds: string[];
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
}) {
  const visible = sectionIds
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s) => applicableFields(s, family).length > 0);

  return (
    <div className="space-y-7">
      {visible.map((section) => (
        <div key={section.id}>
          {sectionIds.length > 1 ? (
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">
              {section.titleEn}
              {section.familySpecific ? (
                <span className="badge bg-steel/10 text-steel">family</span>
              ) : null}
            </h3>
          ) : null}
          <SectionGrid sectionId={section.id} family={family} values={values} set={set} />
        </div>
      ))}
    </div>
  );
}

function ProductStep({
  family,
  values,
  set,
  setFamily,
  fam,
}: {
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
  setFamily: (v: string) => void;
  fam: ReturnType<typeof getFamily>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Tap-changer family
        </h3>
        <FamilyPicker value={family} onChange={setFamily} />
      </div>

      {family ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-navy/15 bg-navy/[0.03] p-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-base font-bold text-navy">{fam?.code}</span>
            {fam?.aliases?.length ? (
              <span className="text-ink-muted">({fam.aliases.join("/")})</span>
            ) : null}
            <span className="badge bg-navy/10 text-navy">{fam ? CATEGORY_LABELS[fam.category] : ""}</span>
          </div>
          <p className="mt-1 text-sm text-ink-soft">{fam?.descEn}</p>
        </motion.div>
      ) : null}

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Drive & accessories
        </h3>
        <SectionGrid sectionId="range" family={family} values={values} set={set} excludeKeys={["family"]} />
      </div>
    </div>
  );
}

function ReviewStep({
  values,
  family,
  typeCompact,
}: {
  values: OrderValues;
  family: string;
  typeCompact: string;
}) {
  if (!family) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Select a tap-changer family in the Product step to review and export.
      </div>
    );
  }
  const rowsBySection = SECTIONS.map((section) => ({
    section,
    fields: allApplicableFields(family)
      .filter((x) => x.section.id === section.id)
      .map((x) => x.field),
  })).filter((g) => g.fields.length > 0);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-navy px-4 py-3 text-white">
        <p className="text-[11px] uppercase tracking-wide text-white/60">Type designation</p>
        <p className="mt-0.5 break-words font-mono text-base font-semibold">{typeCompact || "—"}</p>
      </div>
      {rowsBySection.map(({ section, fields }) => (
        <div key={section.id}>
          <h3 className="mb-1.5 border-b border-slate-100 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {section.titleEn}
          </h3>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.key} className="flex items-baseline justify-between gap-3 py-0.5 text-sm">
                <dt className="text-ink-muted">{field.labelEn}</dt>
                <dd className="text-right font-medium text-ink">
                  {values[field.key] ? `${values[field.key]}${field.unit ? ` ${field.unit}` : ""}` : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function SummaryPanel({
  spaced,
  compact,
  errors,
  warnings,
  fam,
  canExport,
  onExport,
}: {
  spaced: string;
  compact: string;
  errors: string[];
  warnings: string[];
  fam: ReturnType<typeof getFamily>;
  canExport: boolean;
  onExport: () => void;
}) {
  return (
    <div className="card p-5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-muted">
        Type designation
      </h3>
      <div className="mt-3 space-y-3">
        <div>
          <p className="text-[11px] text-slate-400">Spaced (brochure)</p>
          <p className="break-words font-mono text-sm text-ink">{spaced || "—"}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[11px] text-slate-400">Compact (order sheet)</p>
          <p className="break-words font-mono text-sm font-semibold text-navy">{compact || "—"}</p>
        </div>
      </div>

      {fam ? (
        <p className="mt-3 text-xs text-ink-muted">
          <span className="badge bg-navy/10 text-navy">{fam.code}</span>
        </p>
      ) : null}

      {errors.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {errors.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          {warnings.map((w) => (
            <li key={w}>• {w}</li>
          ))}
        </ul>
      )}

      <motion.button
        type="button"
        onClick={onExport}
        disabled={!canExport}
        whileTap={canExport ? { scale: 0.98 } : undefined}
        className="btn-primary mt-5 w-full"
      >
        Download Excel (.xlsx)
      </motion.button>
      <p className="mt-2.5 text-[11px] leading-4 text-slate-400">
        Excel includes a human-readable sheet, a flat machine-readable sheet, and a
        meta sheet.
      </p>
    </div>
  );
}
