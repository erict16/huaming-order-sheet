"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categoryLabel, getFamily } from "@/lib/catalog";
import { UiKey } from "@/lib/i18n";
import {
  allApplicableFields,
  applicableFields,
  displayFieldValue,
  fieldLabel,
  OrderValues,
  SECTIONS,
  sectionTitle,
} from "@/lib/schema";
import { buildTapCode, exportExcel } from "@/lib/excel";
import { composeCompact } from "@/lib/typeString";
import FamilyPicker from "./FamilyPicker";
import Field from "./Field";
import { useLocale } from "./LocaleProvider";
import Stepper from "./Stepper";

const STORAGE_KEY = "hm-order-sheet:v0";

interface WizardStep {
  id: string;
  titleKey: UiKey;
  blurbKey: UiKey;
  sections: string[];
  kind?: "product" | "review";
}

const STEPS: WizardStep[] = [
  { id: "product", titleKey: "stepProduct", blurbKey: "stepProductBlurb", sections: ["range"], kind: "product" },
  { id: "order", titleKey: "stepOrder", blurbKey: "stepOrderBlurb", sections: ["order", "general"] },
  { id: "transformer", titleKey: "stepTransformer", blurbKey: "stepTransformerBlurb", sections: ["transformer"] },
  { id: "oltc", titleKey: "stepOltc", blurbKey: "stepOltcBlurb", sections: ["oltc", "position"] },
  { id: "construction", titleKey: "stepConstruction", blurbKey: "stepConstructionBlurb", sections: ["mechanical", "insulation", "accessories", "notes"] },
  { id: "review", titleKey: "stepReview", blurbKey: "stepReviewBlurb", sections: [], kind: "review" },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -20 : 20, opacity: 0 }),
};

export default function OrderForm() {
  const { t } = useLocale();
  const [values, setValues] = useState<OrderValues>({});
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

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

  const typeCompact = useMemo(() => {
    if (!family) return "";
    return composeCompact({
      family,
      phases: values.phases ?? "",
      currentA: values.oltc_current_a ? Number(values.oltc_current_a) : ("" as const),
      connection: values.oltc_connection ?? "",
      umKv: values.oltc_um_kv ? Number(values.oltc_um_kv) : ("" as const),
      selectorGrade: values.oltc_selector_grade ?? "",
      tapCode: buildTapCode(values),
    });
  }, [family, values]);

  const validation = useMemo(() => {
    const errors: { key: string; message: string }[] = [];
    const warnings: string[] = [];
    if (!family) errors.push({ key: "family", message: t("errFamily") });
    if (!values.phases) errors.push({ key: "phases", message: t("errPhasesLong") });
    const pitch = Number(values.oltc_tap_pitch || 0);
    const positions = Number(values.oltc_tap_positions || 0);
    const mid = Number(values.oltc_tap_mid || 0);
    if (pitch && positions && mid && (positions - mid) % 2 !== 0) {
      warnings.push(t("warnTapCode"));
    }
    return { errors, warnings };
  }, [family, values, t]);

  const canExport = validation.errors.length === 0;
  const stubNote = fam && !fam.modeled ? t("stubLine", { code: fam.code }) : null;
  const phasesError = !values.phases ? t("errPhases") : undefined;

  const go = (i: number) => {
    setDir(i > step ? 1 : -1);
    setStep(Math.max(0, Math.min(STEPS.length - 1, i)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onExport = () => {
    if (!canExport) {
      setShowErrors(true);
      if (!values.phases) go(1);
      else if (!family) go(0);
      return;
    }
    exportExcel(values);
    setToast(t("toastDownloaded"));
    window.setTimeout(() => setToast(null), 2600);
  };

  const onReset = () => {
    if (confirm(t("resetConfirm"))) {
      setValues({});
      setShowErrors(false);
      go(0);
    }
  };

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-xl bg-white/70" />;
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const stepperSteps = STEPS.map((s) => ({ id: s.id, title: t(s.titleKey) }));

  return (
    <div>
      <Stepper steps={stepperSteps} current={step} onGo={go} />

      {typeCompact ? (
        <p className="mb-4 text-sm text-ink-muted">
          {t("typeDesignation")}{" "}
          <span className="font-mono font-medium text-ink">{typeCompact}</span>
        </p>
      ) : null}

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-navy">{t(current.titleKey)}</h2>
          <p className="mt-0.5 text-sm text-ink-muted">{t(current.blurbKey)}</p>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {current.kind === "product" ? (
                <ProductStep
                  family={family}
                  values={values}
                  set={set}
                  setFamily={set("family")}
                  stubNote={stubNote}
                />
              ) : current.kind === "review" ? (
                <ReviewStep
                  values={values}
                  family={family}
                  typeCompact={typeCompact}
                  errors={validation.errors.map((e) => e.message)}
                  stubNote={stubNote}
                  canExport={canExport}
                  onExport={onExport}
                />
              ) : (
                <StepSections
                  sectionIds={current.sections}
                  family={family}
                  values={values}
                  set={set}
                  phasesError={phasesError}
                  showPhasesError={showErrors || current.id === "order"}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="no-print hidden items-center justify-between border-t border-slate-100 px-5 py-4 sm:px-6 md:flex">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-secondary disabled:opacity-40">
            {t("back")}
          </button>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onReset} className="btn-secondary">
              {t("reset")}
            </button>
            {isLast ? (
              <button type="button" onClick={onExport} disabled={!canExport} className="btn-primary">
                {t("downloadExcel")}
              </button>
            ) : (
              <button type="button" onClick={() => go(step + 1)} className="btn-primary">
                {t("next")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-3 py-2.5 md:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn-secondary flex-1 disabled:opacity-40">
            {t("back")}
          </button>
          {isLast ? (
            <button type="button" onClick={onExport} disabled={!canExport} className="btn-primary flex-1">
              {t("downloadShort")}
            </button>
          ) : (
            <button type="button" onClick={() => go(step + 1)} className="btn-primary flex-1">
              {t("next")}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="no-print fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full bg-navy px-4 py-2 text-sm text-white shadow-sm md:bottom-6"
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
  phasesError,
  showPhasesError,
}: {
  sectionId: string;
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
  excludeKeys?: string[];
  phasesError?: string;
  showPhasesError?: boolean;
}) {
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;
  const fields = applicableFields(section, family).filter((f) => !excludeKeys.includes(f.key));
  if (fields.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
      {fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          value={values[field.key] ?? ""}
          onChange={set(field.key)}
          error={field.key === "phases" && showPhasesError ? phasesError : undefined}
        />
      ))}
    </div>
  );
}

function StepSections({
  sectionIds,
  family,
  values,
  set,
  phasesError,
  showPhasesError,
}: {
  sectionIds: string[];
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
  phasesError?: string;
  showPhasesError?: boolean;
}) {
  const { locale, t } = useLocale();
  const visible = sectionIds
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s) => applicableFields(s, family).length > 0);

  return (
    <div className="space-y-7">
      {visible.map((section) => (
        <div key={section.id}>
          {sectionIds.length > 1 ? (
            <h3 className="mb-3 text-sm font-medium text-ink-muted">
              {sectionTitle(section, locale)}
              {section.familySpecific ? <span className="ml-2 text-xs text-slate-400">{t("familySpecific")}</span> : null}
            </h3>
          ) : null}
          <SectionGrid
            sectionId={section.id}
            family={family}
            values={values}
            set={set}
            phasesError={phasesError}
            showPhasesError={showPhasesError}
          />
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
  stubNote,
}: {
  family: string;
  values: OrderValues;
  set: (key: string) => (v: string) => void;
  setFamily: (v: string) => void;
  stubNote: string | null;
}) {
  const { locale, t } = useLocale();
  const fam = getFamily(family);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-muted">{t("familySection")}</h3>
        <FamilyPicker value={family} onChange={setFamily} />
      </div>

      {family && fam ? (
        <p className="text-sm text-ink-soft">
          <span className="font-medium text-ink">{fam.code}</span>
          <span className="mx-2 text-slate-300">·</span>
          {categoryLabel(fam.category, locale)}
          <span className="mx-2 text-slate-300">·</span>
          {locale === "zh" ? fam.descZh : fam.descEn}
        </p>
      ) : null}

      {stubNote ? <p className="text-xs text-ink-muted">{stubNote}</p> : null}

      <div>
        <h3 className="mb-3 text-sm font-medium text-ink-muted">{t("driveSection")}</h3>
        <SectionGrid sectionId="range" family={family} values={values} set={set} excludeKeys={["family"]} />
      </div>
    </div>
  );
}

function ReviewStep({
  values,
  family,
  typeCompact,
  errors,
  stubNote,
  canExport,
  onExport,
}: {
  values: OrderValues;
  family: string;
  typeCompact: string;
  errors: string[];
  stubNote: string | null;
  canExport: boolean;
  onExport: () => void;
}) {
  const { locale, t } = useLocale();

  if (!family) {
    return <p className="text-sm text-ink-muted">{t("reviewNeedFamily")}</p>;
  }

  const rowsBySection = SECTIONS.map((section) => ({
    section,
    fields: allApplicableFields(family)
      .filter((x) => x.section.id === section.id)
      .map((x) => x.field),
  })).filter((g) => g.fields.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-ink-muted">{t("typeDesignation")}</p>
        <p className="mt-0.5 break-words font-mono text-base font-semibold text-navy">{typeCompact || "—"}</p>
        {stubNote ? <p className="mt-2 text-xs text-ink-muted">{stubNote}</p> : null}
      </div>

      {errors.length > 0 ? (
        <ul className="space-y-1 text-sm text-red-600">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      {rowsBySection.map(({ section, fields }) => (
        <div key={section.id}>
          <h3 className="mb-1.5 border-b border-slate-100 pb-1 text-sm font-medium text-ink-muted">
            {sectionTitle(section, locale)}
          </h3>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {fields.map((field) => {
              const raw = values[field.key] ?? "";
              const shown = displayFieldValue(field, raw, locale);
              return (
                <div key={field.key} className="flex items-baseline justify-between gap-3 py-0.5 text-sm">
                  <dt className="text-ink-muted">{fieldLabel(field, locale)}</dt>
                  <dd className="text-right font-medium text-ink">
                    {shown ? `${shown}${field.unit ? ` ${field.unit}` : ""}` : "—"}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}

      <div className="border-t border-slate-100 pt-4">
        <button type="button" onClick={onExport} disabled={!canExport} className="btn-primary">
          {t("downloadExcel")}
        </button>
        <p className="mt-2 text-xs text-ink-muted">{t("excelCaption")}</p>
      </div>
    </div>
  );
}
