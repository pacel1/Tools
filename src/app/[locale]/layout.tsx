import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import "../globals.css";
import { SiteShell } from "@/components/layout/site-shell";
import { locales, siteConfig, type Locale } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildSocialMetadata } from "@/lib/seo/social";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
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
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
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

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${manrope.variable} ${mono.variable} font-sans`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XNY8F6HEGK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XNY8F6HEGK');
          `}
        </Script>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SiteShell locale={locale as Locale}>{children}</SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
