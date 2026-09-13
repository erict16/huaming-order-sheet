"use client";

import { useEffect } from "react";
import { LangProvider, useLang } from "@/lib/useLang";

/** Keep <html lang> in sync after hydration (layout stays RSC with lang="zh-CN"). */
function LangAttr() {
  const { lang } = useLang();
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  }, [lang]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <LangAttr />
      {children}
    </LangProvider>
  );
}
