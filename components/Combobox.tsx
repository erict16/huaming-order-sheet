"use client";

import { useRef, useState, type HTMLAttributes } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import type { FieldOption, Lang } from "@/lib/types";

export default function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder,
  lang,
  allowCustom = false,
  id,
  describedBy,
  required,
  autoComplete = "off",
  inputMode,
}: {
  options: FieldOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  lang: Lang;
  allowCustom?: boolean;
  id?: string;
  describedBy?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  // null = not editing (show selected). "" = user cleared the input.
  const [query, setQuery] = useState<string | null>(null);
  const queryRef = useRef<string | null>(null);
  const selected = options.find((o) => o.value === value);
  const q = (query ?? "").trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => {
        const label = t(o.label, lang).toLowerCase();
        return label.includes(q) || o.value.toLowerCase().includes(q);
      })
    : options;

  function setEditing(next: string | null) {
    queryRef.current = next;
    setQuery(next);
  }

  // allowCustom (country, phone cc): write on close/select, never per keystroke.
  function commitTyped() {
    const typed = (queryRef.current ?? "").trim();
    if (!typed) return;
    const match = options.find(
      (o) => o.value.toLowerCase() === typed.toLowerCase() || t(o.label, lang).toLowerCase() === typed.toLowerCase(),
    );
    onChange(match ? match.value : typed);
  }

  return (
    <Combobox
      value={value || null}
      onChange={(next) => {
        setEditing(null);
        onChange(next ?? "");
      }}
      onClose={() => {
        if (allowCustom) commitTyped();
        setEditing(null);
      }}
      immediate
    >
      <div className="relative">
        <ComboboxInput
          id={id}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="field-control pr-10"
          displayValue={(v: string | null) => {
            if (query !== null) return query;
            if (!v) return "";
            const opt = options.find((o) => o.value === v);
            return opt ? t(opt.label, lang) : v;
          }}
          onChange={(e) => setEditing(e.target.value)}
          placeholder={placeholder}
        />
        <ComboboxButton
          className="absolute inset-y-0 right-0 flex min-w-10 items-center justify-center px-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-steel"
          aria-label={chromeText("search", lang)}
        >
          <ChevronDownIcon className="size-5 text-ink-muted" aria-hidden="true" />
        </ComboboxButton>
        <ComboboxOptions
          anchor="bottom start"
          portal
          transition
          className="plus-options w-[var(--input-width)]"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-ink-muted">{chromeText("noMatches", lang)}</div>
          ) : (
            filtered.map((opt) => (
              <ComboboxOption key={opt.value} value={opt.value} className="plus-option group">
                <span className={`block truncate pr-8 ${selected?.value === opt.value ? "font-semibold" : ""}`}>
                  {t(opt.label, lang)}
                </span>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-3 text-steel group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
