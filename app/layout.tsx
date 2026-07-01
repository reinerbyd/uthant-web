import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import WhatsApp from "@/components/WhatsApp";
import LocaleRuntime from "@/components/LocaleRuntime";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

import { SITE } from "@/lib/content";

const DESC =
  "Freehold luxury homes in Kuala Lumpur's diplomatic Embassy Quarter. A cinematic showcase of the U Thant collection.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "U Thant — Kuala Lumpur's most considered address",
    template: "%s",
  },
  description: DESC,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "U Thant — Kuala Lumpur's most considered address",
    description: DESC,
    url: SITE.url,
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
    title: "U Thant — Kuala Lumpur's most considered address",
    description: DESC,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body suppressHydrationWarning>
        <SmoothScroll />
        <Cursor />
        <LocaleRuntime />
        {children}
        <WhatsApp />
      </body>
    </html>
  );
}
