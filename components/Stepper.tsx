"use client";

import { motion } from "framer-motion";

export interface StepMeta {
  id: string;
  title: string;
}

export default function Stepper({
  steps,
  current,
  onGo,
}: {
  steps: StepMeta[];
  current: number;
  onGo: (i: number) => void;
}) {
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <div className="mb-6">
      {/* Desktop: numbered rail */}
      <ol className="hidden items-center gap-1 md:flex">
        {steps.map((step, i) => {
          const state = i < current ? "done" : i === current ? "active" : "todo";
          return (
            <li key={step.id} className="flex flex-1 items-center gap-1">
              <button
                type="button"
                onClick={() => onGo(i)}
                className="group flex items-center gap-2"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                    state === "done"
                      ? "border-navy bg-navy text-white"
                      : state === "active"
                        ? "border-navy bg-white text-navy ring-4 ring-navy/15"
                        : "border-slate-300 bg-white text-slate-400 group-hover:border-slate-400"
                  }`}
                >
                  {state === "done" ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`whitespace-nowrap text-sm font-medium transition-colors ${
                    state === "todo" ? "text-slate-400" : "text-ink"
                  }`}
                >
                  {step.title}
                </span>
              </button>
              {i < steps.length - 1 ? (
                <span className="mx-1 h-px flex-1 bg-slate-200" />
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* Mobile: compact progress bar */}
      <div className="md:hidden">
        <div className="mb-1.5 flex items-baseline justify-between">
          <p className="text-sm font-semibold text-navy">{steps[current].title}</p>
          <p className="text-xs text-ink-muted">
            Step {current + 1} of {steps.length}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full rounded-full bg-navy"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          />
        </div>
      </div>
    </div>
  );
}
