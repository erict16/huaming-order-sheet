import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huaming Order Sheet",
  description:
    "Fill Huaming tap-changer order parameters in the browser and export a clean Excel.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
