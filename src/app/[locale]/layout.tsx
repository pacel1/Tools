import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";
import { ConsentScriptLoader } from "@/components/layout/consent-script-loader";
import { SiteShell } from "@/components/layout/site-shell";
import { locales, siteConfig, type Locale } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import {
  buildPersonStructuredData,
  buildWebsiteStructuredData
} from "@/lib/seo/eeat-structured-data";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildSocialMetadata } from "@/lib/seo/social";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "ConvertBase.app",
    template: "%s | ConvertBase.app"
  },
  description: normalizeMetaDescription(siteConfig.description),
  applicationName: "ConvertBase.app",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-transparent.png", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: ["/favicon-32x32.png"],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  ...buildSocialMetadata({
    title: "ConvertBase.app",
    description: normalizeMetaDescription(siteConfig.description),
    url: getSiteUrl(),
    locale: siteConfig.defaultLocale
  })
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildWebsiteStructuredData())
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildPersonStructuredData())
          }}
        />
      </head>
      <body className={`${manrope.variable} ${mono.variable} font-sans`}>
        <NextIntlClientProvider locale={locale}>
          <SiteShell locale={locale as Locale}>{children}</SiteShell>
        </NextIntlClientProvider>
        <ConsentScriptLoader />
        <Analytics />
      </body>
    </html>
  );
}
