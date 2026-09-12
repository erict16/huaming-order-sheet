"use client";

import { PIPE_E2_OPTS, PIPE_HEIGHT_OPTS, PIPE_Q_OPTS, PIPE_R_OPTS, PIPE_S_OPTS } from "@/lib/catalog";
import { useLang } from "@/lib/useLang";
import type { FieldOption, OrderValues } from "@/lib/types";
import SelectListbox from "./SelectListbox";

const ROWS: { key: string; heightKey: string; label: string; options: FieldOption[] }[] = [
  { key: "pipe_q", heightKey: "pipe_q_height", label: "Q", options: PIPE_Q_OPTS },
  { key: "pipe_s", heightKey: "pipe_s_height", label: "S", options: PIPE_S_OPTS },
  { key: "pipe_r", heightKey: "pipe_r_height", label: "R", options: PIPE_R_OPTS },
  { key: "pipe_e2", heightKey: "pipe_e2_height", label: "E2", options: PIPE_E2_OPTS },
];

export default function PipeTable({
  values,
  onChange,
}: {
  values: OrderValues;
  onChange: (key: string, v: string) => void;
}) {
  const { lang } = useLang();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="text-left text-ink-muted">
            <th className="w-12 py-2 pr-3 font-semibold">管</th>
            <th className="py-2 pr-3 font-semibold">接头</th>
            <th className="w-36 py-2 font-semibold">管高 mm</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-t border-slate-100">
              <td className="py-2.5 pr-3 align-middle font-semibold text-navy">{row.label}</td>
              <td className="py-2.5 pr-3 align-middle">
                <SelectListbox
                  options={row.options}
                  value={values[row.key] ?? ""}
                  onChange={(v) => onChange(row.key, v)}
                  lang={lang}
                />
              </td>
              <td className="w-36 py-2.5 align-middle">
                <SelectListbox
                  options={PIPE_HEIGHT_OPTS}
                  value={values[row.heightKey] ?? ""}
                  onChange={(v) => onChange(row.heightKey, v)}
                  lang={lang}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
