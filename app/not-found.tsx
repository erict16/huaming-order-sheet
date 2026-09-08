"use client";

import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy">未找到该订货单</h1>
        <p className="mt-2 text-ink-soft">Sheet not found.</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          返回
        </Link>
      </div>
    </AppShell>
  );
}
