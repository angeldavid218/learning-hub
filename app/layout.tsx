import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { resolveBrand } from "@/src/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learning Hub",
  description: "Student portal for The Agent Labs and Time Rich",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const brand = await resolveBrand();

  return (
    <html
      lang="en"
      data-theme={brand.theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
