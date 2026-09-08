import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/components/LocaleProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "华明 · 分接开关订货单",
  description: "在浏览器中填写华明分接开关订货参数并导出 Excel。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
