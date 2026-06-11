import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WealthFlow",
  description: "Personal investment dashboard for ETF and FIRE investors"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
