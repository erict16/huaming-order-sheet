"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PrinterIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { t } from "@/lib/copy";
import { deriveValues } from "@/lib/derive";
import { exportOrderSheet } from "@/lib/excel";
import { chromeText } from "@/lib/i18n";
import {
  applicableFields,
  getSheet,
  missingRequired,
  resolveFieldOptions,
} from "@/lib/schema";
import { clearValues, loadValues, saveValues } from "@/lib/storage";
import { typeFromValues } from "@/lib/typeString";
import type { OrderValues, SheetId } from "@/lib/types";
import { useLang } from "@/lib/useLang";
import FamilyPicker from "./FamilyPicker";
import Field from "./Field";
import ReviewPanel from "./ReviewPanel";

const DEFAULTS: Record<string, OrderValues> = {
  oltc: {
    frequency_hz: "50",
    phases: "III",
    regulation: "reversing",
    plus_minus: "8",
    oltc_tap_mid: "3",
    quantity: "1",
    mdu_model: "CMA7",
    standard: "IEC 60214",
    insulating_fluid: "mineral",
    nameplate_language: "en",
  },
  octc: {
    frequency_hz: "50",
    phases: "III",
    quantity: "1",
    octc_drive: "handwheel",
    connection: "Y",
    octc_series: "IV",
  },
  dry: {
    family: "CZ",
    unit_count: "3",
    phases: "I",
    frequency_hz: "50",
    quantity: "1",
    mdu_model: "CMA7",
    dry_positions: "9",
    oltc_current_a: "500",
    oltc_um_kv: "40.5",
  },
  cma7: {
    frequency_hz: "50",
    quantity: "1",
    motor_voltage: "380_3",
    control_voltage: "220_ac",
    heater: "yes",
    mdu_ip: "IP54",
  },
  "shm-d": {
    frequency_hz: "50",
    quantity: "1",
    shm_model: "SHM-D",
    heater: "yes",
    mdu_ip: "IP54",
  },
};

export default function OrderWizard({ sheetId }: { sheetId: string }) {
  const id = sheetId as SheetId;
  const sheet = getSheet(id);
  const { lang } = useLang();
  const [values, setValues] = useState<OrderValues>(DEFAULTS[id] ?? {});
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState("");

  useEffect(() => {
    const stored = loadValues(id);
    const merged = { ...(DEFAULTS[id] ?? {}), ...stored };
    setValues(deriveValues({}, merged));
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    if (!loaded) return;
    saveValues(id, values);
  }, [loaded, id, values]);

  const typeStr = useMemo(() => typeFromValues(id, values), [id, values]);
  const missing = useMemo(
    () => (sheet ? missingRequired(sheet, values) : []),
    [sheet, values],
  );

  if (!sheet) return null;

  const current = sheet.steps[step];
  const stepCount = sheet.steps.length;

  function setField(key: string, v: string) {
    setValues((prev) => deriveValues(prev, { [key]: v }));
  }

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(stepCount - 1, next)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClear() {
    clearValues(id);
    setValues(DEFAULTS[id] ?? {});
    setStep(0);
  }

  async function handleExport() {
    if (!sheet) return;
    setExportErr("");
    setExporting(true);
    try {
      await exportOrderSheet(sheet, values);
    } catch (err) {
      setExportErr(err instanceof Error ? err.message : String(err));
    } finally {
      setExporting(false);
    }
  }

  const familyBlocked = current.kind === "family" ? !values.family : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
        {t(sheet.meta.tag, lang)}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-navy sm:text-3xl">{t(sheet.meta.title, lang)}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t(current.blurb, lang)}</p>

      <ol className="mt-5 flex flex-wrap gap-2">
        {sheet.steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(i)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                i === step
                  ? "bg-navy text-white"
                  : i < step
                    ? "bg-navy/10 text-navy"
                    : "bg-slate-100 text-ink-muted"
              }`}
            >
              {i + 1}. {t(s.title, lang)}
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-3 text-xs text-ink-muted">
        {chromeText("stepOf", lang, { n: step + 1, total: sheet.steps.length })} · {chromeText("saved", lang)}
      </p>

      <div className="mt-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current.id}
            custom={dir}
            initial={{ x: dir > 0 ? 24 : -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dir > 0 ? -24 : 24, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {current.kind === "family" && sheet.families ? (
              <FamilyPicker
                families={sheet.families}
                value={values.family || ""}
                onChange={(code) => setField("family", code)}
              />
            ) : null}

            {current.kind === "review" ? (
              <div className="space-y-4">
                {missing.length ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <p className="font-semibold">{chromeText("missing", lang)}</p>
                    <ul className="mt-1 list-disc pl-5">
                      {missing.map((f) => (
                        <li key={f.key}>{t(f.label, lang)}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {exportErr ? (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    {exportErr}
                  </p>
                ) : null}
                <ReviewPanel sheet={sheet} values={values} typeStr={typeStr.compact} />
              </div>
            ) : null}

            {current.kind !== "family" && current.kind !== "review"
              ? current.sections.map((section) => {
                  const fields = applicableFields(section, values).map((f) =>
                    resolveFieldOptions(f, values),
                  );
                  if (!fields.length) return null;
                  return (
                    <section key={section.id} className="card mb-5 p-5 sm:p-6">
                      <h2 className="text-lg font-semibold text-navy">{t(section.title, lang)}</h2>
                      {section.hint ? (
                        <p className="mt-1 text-sm text-ink-soft">{t(section.hint, lang)}</p>
                      ) : null}
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                          <Field
                            key={field.key}
                            field={field}
                            value={values[field.key] ?? ""}
                            onChange={(v) => setField(field.key, v)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })
              : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="no-print sticky bottom-3 z-20 mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-card backdrop-blur">
        <button type="button" className="btn-secondary" disabled={step === 0} onClick={() => go(step - 1)}>
          <ArrowLeftIcon className="h-4 w-4" />
          {chromeText("prev", lang)}
        </button>
        {step < sheet.steps.length - 1 ? (
          <button
            type="button"
            className="btn-primary"
            disabled={familyBlocked}
            onClick={() => go(step + 1)}
          >
            {chromeText("next", lang)}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" className="btn-primary" disabled={exporting} onClick={() => void handleExport()}>
            {exporting ? "…" : chromeText("export", lang)}
          </button>
        )}
        <button type="button" className="btn-secondary ml-auto" onClick={() => window.print()}>
          <PrinterIcon className="h-4 w-4" />
          {chromeText("print", lang)}
        </button>
        <button type="button" className="btn-secondary text-rose-700" onClick={handleClear}>
          <TrashIcon className="h-4 w-4" />
          {chromeText("clear", lang)}
        </button>
      </div>
    </div>
  );
}
