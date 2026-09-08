import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "华明订货技术规范书 | Huaming Order Sheet",
  description:
    "Shanghai Huaming tap-changer order specifications — OLTC, OCTC, dry-type, CMA7 and SHM-D. Fill in the browser, export Excel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
