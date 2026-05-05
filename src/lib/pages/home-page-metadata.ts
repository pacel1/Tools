import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";

export async function buildHomePageMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const canonical = `${getSiteUrl()}/${locale}`;
  const description = normalizeMetaDescription(
    t("heroDescription"),
    t("siteTagline")
  );

  return {
    title: t("heroTitle"),
    description,
    alternates: {
      canonical,
      ...buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    },
    openGraph: {
      title: `${t("heroTitle")} | ${getSiteName()}`,
      description,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}
