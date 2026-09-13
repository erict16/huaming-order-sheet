"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { t } from "@/lib/copy";
import type { FieldOption, Lang } from "@/lib/types";

export default function SelectListbox({
  options,
  value,
  onChange,
  lang,
  allowEmpty = true,
  id,
  describedBy,
  required,
}: {
  options: FieldOption[];
  value: string;
  onChange: (v: string) => void;
  lang: Lang;
  allowEmpty?: boolean;
  id?: string;
  describedBy?: string;
  required?: boolean;
}) {
  const selected = options.find((o) => o.value === value);
  const items = allowEmpty
    ? [{ value: "", label: { zh: "—", en: "—", ru: "—", vi: "—" } }, ...options]
    : options;

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton
          id={id}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className="plus-trigger"
        >
          <span className={`block min-w-0 truncate ${selected ? "text-ink" : "text-slate-400"}`}>
            {selected ? t(selected.label, lang) : "—"}
          </span>
          <ChevronDownIcon
            className="pointer-events-none absolute right-2.5 top-1/2 size-5 -translate-y-1/2 text-ink-muted"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          portal
          transition
          className="plus-options w-[var(--button-width)]"
        >
          {items.map((opt) => (
            <ListboxOption key={opt.value || "__empty"} value={opt.value} className="plus-option group">
              <span className={`block truncate pr-8 ${opt.value === value ? "font-semibold" : ""}`}>
                {opt.value ? t(opt.label, lang) : "—"}
              </span>
              {opt.value === value ? (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-steel group-data-[focus]:text-white">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              ) : null}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
