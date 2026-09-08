"use client";

import { motion } from "framer-motion";
import {
  CATEGORY_LABELS,
  FAMILIES,
  FamilyDef,
  ProductCategory,
} from "@/lib/catalog";

const CATEGORY_ORDER: ProductCategory[] = [
  "OLTC_OIL",
  "OLTC_VACUUM",
  "OLTC_DRY",
  "OCTC",
  "SVR",
  "MDU",
  "ACCESSORY",
];

const CATEGORY_ACCENT: Record<ProductCategory, string> = {
  OLTC_OIL: "bg-navy/10 text-navy",
  OLTC_VACUUM: "bg-steel/10 text-steel",
  OLTC_DRY: "bg-amber-100 text-amber-700",
  OCTC: "bg-emerald-100 text-emerald-700",
  SVR: "bg-violet-100 text-violet-700",
  MDU: "bg-slate-200 text-slate-700",
  ACCESSORY: "bg-slate-200 text-slate-700",
  AFTERSALES: "bg-slate-200 text-slate-700",
};

export default function FamilyPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: FAMILIES.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => (
        <div key={group.cat}>
          <div className="mb-2 flex items-center gap-2">
            <span className={`badge ${CATEGORY_ACCENT[group.cat]}`}>
              {CATEGORY_LABELS[group.cat]}
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map((fam) => (
              <FamilyCard
                key={fam.code}
                fam={fam}
                selected={value === fam.code}
                onSelect={() => onChange(fam.code)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FamilyCard({
  fam,
  selected,
  onSelect,
}: {
  fam: FamilyDef;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      className={`group relative flex h-full flex-col rounded-xl border p-3 text-left transition-colors ${
        selected
          ? "border-navy bg-navy/[0.04] ring-2 ring-navy/30"
          : "border-slate-200 bg-white hover:border-steel/60 hover:bg-steel/[0.03]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-base font-bold ${selected ? "text-navy" : "text-ink"}`}>
          {fam.code}
        </span>
        {fam.modeled ? (
          <span className="badge bg-emerald-100 px-1.5 text-[10px] text-emerald-700">v0</span>
        ) : null}
      </div>
      {fam.aliases?.length ? (
        <span className="mt-0.5 text-[11px] font-medium text-ink-muted">
          {fam.aliases.join(" / ")}
        </span>
      ) : null}
      <span className="mt-1.5 line-clamp-3 text-[11px] leading-4 text-ink-muted">
        {fam.descEn}
      </span>
    </motion.button>
  );
}
