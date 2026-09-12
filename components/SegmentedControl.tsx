"use client";

import { Radio, RadioGroup } from "@headlessui/react";

export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  fullWidth,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; disabled?: boolean; title?: string }[];
  fullWidth?: boolean;
}) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className={`rounded-lg bg-slate-100 p-1 ring-1 ring-inset ring-slate-200 ${
        fullWidth ? "flex w-full" : "inline-flex"
      }`}
    >
      {options.map((opt) => {
        const reason = opt.disabled ? opt.title : undefined;
        return (
          <span
            key={opt.value}
            title={reason}
            className={fullWidth ? "flex min-w-0 flex-1" : "inline-flex"}
          >
            <Radio
              value={opt.value}
              disabled={opt.disabled}
              title={reason}
              aria-label={reason ? `${opt.label}. ${reason}` : undefined}
              className={`inline-flex min-h-10 w-full items-center justify-center rounded-md px-3.5 text-sm font-semibold text-ink-soft transition-colors duration-150 active:translate-y-px
                data-[checked]:bg-navy data-[checked]:text-white data-[checked]:shadow-sm
                data-[hover]:text-navy data-[checked]:data-[hover]:text-white
                data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40
                focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-steel`}
            >
              {opt.label}
            </Radio>
          </span>
        );
      })}
    </RadioGroup>
  );
}
