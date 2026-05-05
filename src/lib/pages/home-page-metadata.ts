import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildTitledPageTitle, normalizeMetaTitle } from "@/lib/seo/meta-title";
import { buildSocialMetadata } from "@/lib/seo/social";

export async function buildHomePageMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "common" });
  const canonical = `${getSiteUrl()}/${locale}`;
  const title = normalizeMetaTitle(t("heroTitle"));
  const description = normalizeMetaDescription(
    t("heroDescription"),
    t("siteTagline")
  );

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical,
      ...buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    },
    ...buildSocialMetadata({
      title: buildTitledPageTitle(title),
      description,
      url: canonical,
      locale
    })
  };
}
