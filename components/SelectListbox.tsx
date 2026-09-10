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
}: {
  options: FieldOption[];
  value: string;
  onChange: (v: string) => void;
  lang: Lang;
  allowEmpty?: boolean;
}) {
  const selected = options.find((o) => o.value === value);
  const items = allowEmpty ? [{ value: "", label: selected ? { zh: "—", en: "—", ru: "—", vi: "—" } : { zh: "—", en: "—", ru: "—", vi: "—" } }, ...options] : options;

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <ListboxButton className="plus-trigger">
          <span className={`block truncate ${selected ? "text-ink" : "text-slate-400"}`}>
            {selected ? t(selected.label, lang) : "—"}
          </span>
          <ChevronDownIcon className="absolute right-2.5 size-5 text-ink-muted" />
        </ListboxButton>
        <ListboxOptions transition className="plus-options">
          {items.map((opt) => (
            <ListboxOption key={opt.value || "__empty"} value={opt.value} className="plus-option group">
              <span className={`block truncate ${opt.value === value ? "font-semibold" : ""}`}>
                {opt.value ? t(opt.label, lang) : "—"}
              </span>
              {opt.value === value ? (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-steel group-data-[focus]:text-white">
                  <CheckIcon className="size-5" />
                </span>
              ) : null}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
