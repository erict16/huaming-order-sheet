"use client";

import { Description, Field as HeadlessField, Label, Radio, RadioGroup } from "@headlessui/react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import type { HTMLAttributes } from "react";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";
import type { FieldDef, Lang } from "@/lib/types";
import Combobox from "./Combobox";
import SelectListbox from "./SelectListbox";

const radioChipClass =
  "inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg bg-white px-3.5 py-2.5 text-[15px] text-ink-soft shadow-sm ring-1 ring-inset ring-slate-300 transition-[color,background-color,box-shadow,transform] duration-150 active:translate-y-px focus:outline-none data-[checked]:bg-navy data-[checked]:text-white data-[checked]:ring-navy data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-steel [@media(hover:hover)]:data-[hover]:ring-slate-400";

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
  const controlId = field.key;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const autoComplete = fieldAutoComplete(field.key);
  const inputMode = fieldInputMode(field);

  if (field.type === "radio" && field.options) {
    return (
      <RadioGroup
        as="fieldset"
        id={controlId}
        value={value}
        onChange={onChange}
        aria-required={field.required || undefined}
        className={`field-set ${span}`}
      >
        <Label as="legend" className="field-label">
          <FieldCaption field={field} label={label} lang={lang} />
        </Label>
        <div className="flex flex-wrap gap-2">
          {field.options.map((opt) => (
            <Radio key={opt.value} value={opt.value} className={radioChipClass}>
              {t(opt.label, lang)}
            </Radio>
          ))}
        </div>
        {hint && hintId ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      </RadioGroup>
    );
  }

  return (
    <HeadlessField className={`block min-w-0 ${span}`}>
      <label htmlFor={controlId} className="field-label">
        <FieldCaption field={field} label={label} lang={lang} />
      </label>
      <Control
        field={field}
        value={value}
        onChange={onChange}
        placeholder={ph}
        lang={lang}
        id={controlId}
        describedBy={hintId}
        required={field.required}
        autoComplete={autoComplete}
        inputMode={inputMode}
      />
      {hint && hintId ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
    </HeadlessField>
  );
}

function FieldCaption({ field, label, lang }: { field: FieldDef; label: string; lang: Lang }) {
  return (
    <>
      {label}
      {field.unit ? <span className="ml-1 font-normal text-ink-muted">({field.unit})</span> : null}
      {field.required ? (
        <span className="ml-1 text-xs font-semibold text-rose-600">{chromeText("required", lang)}</span>
      ) : null}
    </>
  );
}

function FieldHint({ id, children }: { id: string; children: string }) {
  return (
    <Description id={id} className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
      {children}
    </Description>
  );
}

function Control({
  field,
  value,
  onChange,
  placeholder,
  lang,
  id,
  describedBy,
  required,
  autoComplete,
  inputMode,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  lang: Lang;
  id: string;
  describedBy?: string;
  required?: boolean;
  autoComplete: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  if (field.type === "combobox") {
    return (
      <Combobox
        id={id}
        describedBy={describedBy}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        options={field.options ?? []}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        lang={lang}
        allowCustom={field.key === "designer_phone_cc" || field.key === "country"}
      />
    );
  }

  if (field.type === "select") {
    return (
      <SelectListbox
        id={id}
        describedBy={describedBy}
        required={required}
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
        id={id}
        name={field.key}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        autoComplete={autoComplete}
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
          id={id}
          name={field.key}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          autoComplete={autoComplete}
          className="field-control pr-10"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={(e) => {
            const el = e.currentTarget;
            if (typeof el.showPicker === "function") el.showPicker();
          }}
        />
        <CalendarDaysIcon
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
    );
  }

  const tel = field.key === "designer_phone" || field.key === "designer_phone_cc_other";
  const input = (
    <input
      id={id}
      name={field.key}
      aria-describedby={describedBy}
      aria-required={required || undefined}
      autoComplete={autoComplete}
      inputMode={inputMode}
      spellCheck={tel || field.type === "number" ? false : undefined}
      className={`field-control ${field.prefix ? "pl-8" : ""}`}
      type={tel ? "tel" : field.type === "number" ? "number" : "text"}
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

function fieldAutoComplete(key: string): string {
  switch (key) {
    case "designer_name":
      return "name";
    case "designer_phone":
      return "tel-national";
    case "designer_phone_cc":
    case "designer_phone_cc_other":
      return "tel-country-code";
    case "country":
      return "country-name";
    case "buyer":
    case "end_user":
      return "organization";
    default:
      return "off";
  }
}

function fieldInputMode(field: FieldDef): HTMLAttributes<HTMLInputElement>["inputMode"] {
  if (field.key === "designer_phone" || field.key === "designer_phone_cc" || field.key === "designer_phone_cc_other") {
    return "tel";
  }
  if (field.type === "number") return "decimal";
  return undefined;
}
