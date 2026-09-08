"use client";

import { t } from "@/lib/copy";
import { PIPE_E2_OPTS, PIPE_HEIGHT_OPTS, PIPE_Q_OPTS, PIPE_R_OPTS, PIPE_S_OPTS } from "@/lib/catalog";
import { useLang } from "@/lib/useLang";
import type { FieldOption, OrderValues } from "@/lib/types";

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
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="text-left text-ink-muted">
            <th className="w-12 py-2 pr-3 font-semibold">管</th>
            <th className="py-2 pr-3 font-semibold">接头</th>
            <th className="w-28 py-2 font-semibold">管高</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-t border-slate-100">
              <td className="py-2.5 pr-3 font-semibold text-navy">{row.label}</td>
              <td className="py-2.5 pr-3">
                <select
                  className="field-control"
                  value={values[row.key] ?? ""}
                  onChange={(e) => onChange(row.key, e.target.value)}
                >
                  <option value="">—</option>
                  {row.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.label, lang)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2.5">
                <select
                  className="field-control"
                  value={values[row.heightKey] ?? ""}
                  onChange={(e) => onChange(row.heightKey, e.target.value)}
                >
                  <option value="">—</option>
                  {PIPE_HEIGHT_OPTS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {t(opt.label, lang)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
