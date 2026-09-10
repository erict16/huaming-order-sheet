"use client";

import { useState } from "react";
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
}: {
  options: FieldOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  lang: Lang;
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => {
        const label = t(o.label, lang).toLowerCase();
        return label.includes(q) || o.value.toLowerCase().includes(q);
      })
    : options;

  return (
    <Combobox
      value={value || null}
      onChange={(next) => {
        if (next) onChange(next);
      }}
      onClose={() => setQuery("")}
      immediate
    >
      <div className="relative">
        <ComboboxInput
          className="field-control pr-10"
          displayValue={(v: string | null) => {
            if (!v) return "";
            const opt = options.find((o) => o.value === v);
            return opt ? t(opt.label, lang) : v;
          }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2.5">
          <ChevronDownIcon className="size-5 text-ink-muted" />
        </ComboboxButton>
        <ComboboxOptions transition className="plus-options">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-ink-muted">{chromeText("noMatches", lang)}</div>
          ) : (
            filtered.map((opt) => (
              <ComboboxOption key={opt.value} value={opt.value} className="plus-option group">
                <span className={`block truncate ${selected?.value === opt.value ? "font-semibold" : ""}`}>
                  {t(opt.label, lang)}
                </span>
                <span className="absolute inset-y-0 right-0 hidden items-center pr-3 text-steel group-data-[selected]:flex group-data-[focus]:text-white">
                  <CheckIcon className="size-5" />
                </span>
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
