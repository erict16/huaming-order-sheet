"use client";

import { LangProvider } from "@/lib/useLang";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
