import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
  display: "swap",
});

/** Must match next.config basePath so GH Pages favicon URLs resolve. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "华明订货技术规范书 | Huaming Order Sheet",
  description:
    "Shanghai Huaming tap-changer order specifications — OLTC, OCTC, dry-type, CMA7 and SHM-D. Fill in the browser, download the official order sheet.",
  icons: {
    icon: [
      { url: `${basePath}/brand/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${basePath}/brand/favicon-48.png`, sizes: "48x48", type: "image/png" },
    ],
    shortcut: `${basePath}/brand/favicon-32.png`,
    apple: [{ url: `${basePath}/brand/apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href={`${basePath}/brand/favicon-32.png`} type="image/png" sizes="32x32" />
        <link rel="icon" href={`${basePath}/brand/favicon-48.png`} type="image/png" sizes="48x48" />
        <link rel="shortcut icon" href={`${basePath}/brand/favicon-32.png`} type="image/png" />
        <link rel="apple-touch-icon" href={`${basePath}/brand/apple-touch-icon.png`} sizes="180x180" />
      </head>
      <body className={`${sans.className} ${mono.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
