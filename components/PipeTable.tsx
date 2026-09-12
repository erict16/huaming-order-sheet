"use client";

import { PIPE_E2_OPTS, PIPE_HEIGHT_OPTS, PIPE_Q_OPTS, PIPE_R_OPTS, PIPE_S_OPTS } from "@/lib/catalog";
import { chromeText } from "@/lib/i18n";
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
    <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-ink-muted">
            <th scope="col" className="w-12 px-3 py-2.5 font-semibold">
              {chromeText("pipeCol", lang)}
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold">
              {chromeText("pipeJoint", lang)}
            </th>
            <th scope="col" className="w-36 px-3 py-2.5 font-semibold">
              {chromeText("pipeHeight", lang)}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-t border-slate-100">
              <th scope="row" className="px-3 py-2.5 align-middle font-semibold text-navy">
                {row.label}
              </th>
              <td className="px-3 py-2.5 align-middle">
                <SelectListbox
                  options={row.options}
                  value={values[row.key] ?? ""}
                  onChange={(v) => onChange(row.key, v)}
                  lang={lang}
                />
              </td>
              <td className="w-36 px-3 py-2.5 align-middle tabular-nums">
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
