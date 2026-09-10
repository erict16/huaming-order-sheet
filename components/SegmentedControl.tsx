"use client";

import { Radio, RadioGroup } from "@headlessui/react";

export default function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; disabled?: boolean }[];
}) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="inline-flex rounded-lg bg-slate-100 p-0.5 shadow-sm ring-1 ring-inset ring-slate-200"
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          className="rounded-md px-3.5 py-1.5 text-sm font-semibold text-ink-soft transition
            data-[checked]:bg-white data-[checked]:text-navy data-[checked]:shadow-sm data-[checked]:ring-1 data-[checked]:ring-slate-200
            data-[hover]:text-navy
            data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40
            focus:outline-none data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-steel"
        >
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
