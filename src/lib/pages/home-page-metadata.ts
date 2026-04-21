import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";

export async function buildHomePageMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const canonical = `${getSiteUrl()}/${locale}`;

  return {
    title: t("heroTitle"),
    description: t("heroDescription"),
    alternates: {
      canonical,
      ...buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    },
    openGraph: {
      title: `${t("heroTitle")} | ${getSiteName()}`,
      description: t("heroDescription"),
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}
