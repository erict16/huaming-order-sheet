"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";
import { chromeText } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function NotFound() {
  const { lang } = useLang();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-navy">未找到该订货单</h1>
        <p className="mt-2 text-sm text-ink-soft">Sheet not found.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex min-h-10">
          {chromeText("backHome", lang)}
        </Link>
      </div>
    </AppShell>
  );
}
