"use client";

import { motion } from "framer-motion";
import { categoryLabel, FAMILIES, FamilyDef, ProductCategory } from "@/lib/catalog";
import { useLocale } from "./LocaleProvider";

const CATEGORY_ORDER: ProductCategory[] = [
  "OLTC_OIL",
  "OLTC_VACUUM",
  "OLTC_DRY",
  "OCTC",
  "SVR",
  "MDU",
  "ACCESSORY",
];

export default function FamilyPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const { locale, t } = useLocale();
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: FAMILIES.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => (
        <div key={group.cat}>
          <p className="mb-2 text-xs font-medium text-ink-muted">{categoryLabel(group.cat, locale)}</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map((fam) => (
              <FamilyCard
                key={fam.code}
                fam={fam}
                selected={value === fam.code}
                modeledLabel={t("modeled")}
                onSelect={() => onChange(fam.code)}
                locale={locale}
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
  modeledLabel,
  onSelect,
  locale,
}: {
  fam: FamilyDef;
  selected: boolean;
  modeledLabel: string;
  onSelect: () => void;
  locale: "zh" | "en";
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={`flex h-full flex-col rounded-lg border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-navy bg-navy/[0.04] ring-2 ring-navy/20"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-sm font-semibold ${selected ? "text-navy" : "text-ink"}`}>{fam.code}</span>
        {fam.modeled ? <span className="text-[10px] text-ink-muted">{modeledLabel}</span> : null}
      </div>
      <span className="mt-1 line-clamp-2 text-[12px] leading-4 text-ink-muted">
        {locale === "zh" ? fam.descZh : fam.descEn}
      </span>
    </motion.button>
  );
}
