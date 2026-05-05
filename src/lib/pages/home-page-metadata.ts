import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildTitledPageTitle, normalizeMetaTitle } from "@/lib/seo/meta-title";

export async function buildHomePageMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const canonical = `${getSiteUrl()}/${locale}`;
  const title = normalizeMetaTitle(t("heroTitle"));
  const description = normalizeMetaDescription(
    t("heroDescription"),
    t("siteTagline")
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      ...buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    },
    openGraph: {
      title: buildTitledPageTitle(title),
      description,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}
