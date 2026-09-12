"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { t } from "@/lib/copy";
import { SHEET_DEFAULTS } from "@/lib/defaults";
import { deriveValues } from "@/lib/derive";
import {
  defaultExportFormat,
  exportOrderSheet,
  hasWordExport,
  type ExportFormat,
} from "@/lib/exportClient";
import { chromeText } from "@/lib/i18n";
import { applyPreset, hydrateSheetValues, pendingPresetKey } from "@/lib/presets";
import {
  applicableFields,
  getSheet,
  missingRequired,
  resolveFieldOptions,
} from "@/lib/schema";
import { clearValues, loadValues, saveValues } from "@/lib/storage";
import { typeFromValues } from "@/lib/typeString";
import type { Lang, OrderValues, SheetId } from "@/lib/types";
import { useLang } from "@/lib/useLang";
import FamilyPicker from "./FamilyPicker";
import Field from "./Field";
import PipeTable from "./PipeTable";
import PresetPicker from "./PresetPicker";
import ReviewPanel from "./ReviewPanel";
import SegmentedControl from "./SegmentedControl";
import TypePlate from "./TypePlate";

export default function OrderWizard({ sheetId }: { sheetId: string }) {
  const id = sheetId as SheetId;
  const sheet = getSheet(id);
  const { lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [values, setValues] = useState<OrderValues>(SHEET_DEFAULTS[id] ?? {});
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(
    sheet ? defaultExportFormat(sheet) : "excel",
  );
  const footerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const apply = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      el.parentElement?.style.setProperty("--wizard-footer-h", `${h}px`);
      root.style.scrollPaddingBottom = `${h}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      el.parentElement?.style.removeProperty("--wizard-footer-h");
      root.style.scrollPaddingBottom = "";
    };
  }, [lang, step, savedFlash, exporting, exportFormat]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("preset");
    const sessionKey = pendingPresetKey(id);
    if (q) sessionStorage.setItem(sessionKey, q);
    const pending = sessionStorage.getItem(sessionKey);
    const next = hydrateSheetValues(id, window.location.search, loadValues(id), pending);
    saveValues(id, next);
    setValues(next);
    const fromPreset = !!(q || pending);
    if (fromPreset) {
      sessionStorage.removeItem(sessionKey);
      if (q) {
        const url = new URL(window.location.href);
        url.searchParams.delete("preset");
        window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      }
      const sh = getSheet(id);
      if (sh?.steps[0]?.kind === "family" && next.family) setStep(1);
    }
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
    setStep(Math.max(0, Math.min(stepCount - 1, next)));
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function handleClear() {
    clearValues(id);
    setValues(deriveValues({}, SHEET_DEFAULTS[id] ?? {}));
    setStep(0);
  }

  async function handleExport() {
    if (!sheet) return;
    setExportErr("");
    setExporting(true);
    try {
      await exportOrderSheet(sheet, values, exportFormat);
    } catch (err) {
      setExportErr(err instanceof Error ? err.message : String(err));
    } finally {
      setExporting(false);
    }
  }

  function handleSave() {
    if (!sheet) return;
    saveValues(id, values);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1600);
  }

  const familyBlocked = current.kind === "family" ? !values.family : false;
  const canWord = hasWordExport(sheet);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <p className="text-sm text-ink-muted">{t(sheet.meta.tag, lang)}</p>
        <h1 className="mt-1 text-balance text-[1.75rem] font-semibold leading-tight text-navy sm:text-[2rem]">
          {t(sheet.meta.title, lang)}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {chromeText("stepOf", lang, { n: step + 1, total: sheet.steps.length })}
          <span className="text-ink-soft"> · {t(current.title, lang)}</span>
        </p>
      </div>

      <nav
        className="mt-5 flex items-center justify-center gap-1 overflow-x-auto"
        aria-label={chromeText("stepOf", lang, { n: step + 1, total: sheet.steps.length })}
      >
        {sheet.steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            title={t(s.title, lang)}
            aria-label={t(s.title, lang)}
            aria-current={i === step ? "step" : undefined}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums transition-colors duration-150 active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-steel focus-visible:ring-offset-2 ${
              i === step
                ? "bg-navy text-white"
                : i < step
                  ? "bg-navy-50 text-navy"
                  : "bg-white text-ink-muted ring-1 ring-slate-200 hover:bg-navy-50"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </nav>

      {typeStr.compact ? (
        <div className="mt-5">
          <TypePlate compact={typeStr.compact} />
        </div>
      ) : null}

      {t(current.blurb, lang).trim() ? (
        <p className="mt-4 text-pretty text-sm text-ink-soft">{t(current.blurb, lang)}</p>
      ) : null}

      <div className="mt-6 overflow-hidden pb-[var(--wizard-footer-h,7.5rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.12 }}
          >
            {step === 0 && current.kind !== "family" ? (
              <PresetPicker
                sheetId={id}
                onApply={(preset) => {
                  setValues(applyPreset(preset));
                }}
              />
            ) : null}

            {current.kind === "family" && sheet.families ? (
              <div className="scroll-mb-[var(--wizard-footer-h,7.5rem)] space-y-5">
                <FamilyPicker
                  families={sheet.families}
                  value={values.family || ""}
                  onChange={(code) => setField("family", code)}
                />
                <PresetPicker
                  sheetId={id}
                  onApply={(preset) => {
                    setValues(applyPreset(preset));
                    go(1);
                  }}
                />
              </div>
            ) : null}

            {current.kind === "review" ? (
              <div className="scroll-mb-[var(--wizard-footer-h,7.5rem)] space-y-4">
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
                <ExportFormatControl
                  format={exportFormat}
                  onChange={setExportFormat}
                  canWord={canWord}
                  lang={lang}
                />
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
                    <section key={section.id} className="card mb-5 scroll-mb-[var(--wizard-footer-h,7.5rem)] p-5 sm:p-6">
                      <h2 className="text-lg font-semibold text-navy">{t(section.title, lang)}</h2>
                      {section.hint ? (
                        <p className="mt-1 text-sm text-ink-soft">{t(section.hint, lang)}</p>
                      ) : null}
                      {section.id === "pipes" ? (
                        <div className="mt-4">
                          <PipeTable values={values} onChange={setField} />
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          {fields.map((field) => {
                            if (field.key === "designer_phone") return null;
                            if (field.key === "designer_phone_cc") {
                              const num = fields.find((f) => f.key === "designer_phone");
                              return (
                                <div key="phone" className="grid grid-cols-[minmax(8.5rem,11rem)_1fr] gap-3 sm:col-span-2">
                                  <Field
                                    field={field}
                                    value={values.designer_phone_cc ?? ""}
                                    onChange={(v) => setField("designer_phone_cc", v)}
                                  />
                                  {num ? (
                                    <Field
                                      field={num}
                                      value={values.designer_phone ?? ""}
                                      onChange={(v) => setField("designer_phone", v)}
                                    />
                                  ) : null}
                                </div>
                              );
                            }
                            return (
                              <Field
                                key={field.key}
                                field={field}
                                value={values[field.key] ?? ""}
                                onChange={(v) => setField(field.key, v)}
                              />
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })
              : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        ref={footerRef}
        className="no-print sticky bottom-0 z-20 mt-8 flex flex-wrap items-center gap-2 border-t border-slate-200 bg-[#f4f6f8] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex min-w-0 flex-wrap gap-2">
          {step === 0 ? (
            <Link href="/" className="btn-secondary min-h-10">
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              {chromeText("backHome", lang)}
            </Link>
          ) : (
            <button type="button" className="btn-secondary min-h-10" onClick={() => go(step - 1)}>
              <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
              {chromeText("prev", lang)}
            </button>
          )}
          {step < sheet.steps.length - 1 ? (
            <button
              type="button"
              className="btn-primary min-h-10"
              disabled={familyBlocked}
              onClick={() => go(step + 1)}
            >
              {chromeText("next", lang)}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="btn-primary min-h-10"
              disabled={exporting}
              aria-busy={exporting}
              onClick={() => void handleExport()}
            >
              {exporting
                ? chromeText("exporting", lang)
                : exportFormat === "word"
                  ? chromeText("exportWord", lang)
                  : chromeText("exportExcel", lang)}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <button
            type="button"
            className="btn-secondary min-h-10"
            onClick={handleSave}
            aria-live="polite"
          >
            {savedFlash ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : null}
            {savedFlash ? chromeText("savedFlash", lang) : chromeText("save", lang)}
          </button>
          <button type="button" className="btn-secondary min-h-10 text-rose-700" onClick={handleClear}>
            <TrashIcon className="h-4 w-4" aria-hidden="true" />
            {chromeText("clear", lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportFormatControl({
  format,
  onChange,
  canWord,
  lang,
}: {
  format: ExportFormat;
  onChange: (v: ExportFormat) => void;
  canWord: boolean;
  lang: Lang;
}) {
  return (
    <fieldset className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <legend className="px-1 text-sm font-semibold text-navy">{chromeText("exportFormat", lang)}</legend>
      <div className="mt-2">
        <SegmentedControl
          fullWidth
          value={format}
          onChange={onChange}
          options={[
            { value: "word", label: chromeText("exportWord", lang), disabled: !canWord },
            { value: "excel", label: chromeText("exportExcel", lang) },
          ]}
        />
      </div>
    </fieldset>
  );
}
