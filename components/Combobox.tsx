"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { t } from "@/lib/copy";
import { chromeText } from "@/lib/i18n";
import type { FieldOption, Lang } from "@/lib/types";

export default function Combobox({
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
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const selected = options.find((o) => o.value === value);
  const display = selected ? t(selected.label, lang) : value || placeholder || "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const label = t(o.label, lang).toLowerCase();
      return label.includes(q) || o.value.toLowerCase().includes(q);
    });
  }, [options, query, lang]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  function onListKey(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[active];
      if (opt) pick(opt.value);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="field-control flex items-center justify-between gap-2 text-left"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selected || value ? "text-ink" : "text-slate-400"}>{display}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 text-ink-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <MagnifyingGlassIcon className="h-4 w-4 text-ink-muted" />
            <input
              ref={searchRef}
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
              placeholder={chromeText("search", lang)}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onListKey}
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-60 overflow-auto py-1">
            {filtered.length ? (
              filtered.map((opt, i) => {
                const isOn = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isOn}
                      className={`flex w-full px-3 py-2 text-left text-sm ${
                        i === active ? "bg-navy/5 text-navy" : "text-ink"
                      } ${isOn ? "font-semibold" : ""}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(opt.value)}
                    >
                      {t(opt.label, lang)}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 text-sm text-ink-muted">{chromeText("noMatches", lang)}</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
