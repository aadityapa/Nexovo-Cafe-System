import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BRAND } from "../lib/brand";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${BRAND.product} | Enterprise Restaurant ERP`,
  description: `${BRAND.tagline} — POS, KDS, inventory, GST billing, multi-branch (INR)`
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
