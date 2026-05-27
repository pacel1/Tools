import type { MetadataRoute } from "next";
import { locales } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import {
  getLegalPagePath,
  legalPageKeys,
  noindexLegalPageKeys,
  type LegalPageKey
} from "@/lib/pages/types";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { getIndexableCategories } from "@/lib/tools/categories";
import {
  buildStorageHubHref,
  getStorageHubContent
} from "@/lib/tools/discovery";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type { ToolLocaleContent } from "@/lib/tools/types";

const noindexLegalPageKeySet = new Set<LegalPageKey>(noindexLegalPageKeys);

function isIndexableLegalPageKey(pageKey: LegalPageKey) {
  return !noindexLegalPageKeySet.has(pageKey);
}

// Data ostatniego buildu / deployu — Google używa lastModified do oceny świeżości.
// Jeśli posiadasz daty per-narzędzie, warto je wstrzyknąć z tool definition.
const BUILD_DATE = new Date();

export function buildSitemapEntries(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const indexableLegalPageKeys = legalPageKeys.filter(isIndexableLegalPageKey);

  const staticEntries = [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      lastModified: BUILD_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    })),
    ...locales.flatMap((locale) =>
      getIndexableCategories(locale).map((category) => ({
        url: `${baseUrl}/${locale}/${category}`,
        lastModified: BUILD_DATE,
        changeFrequency: "weekly" as const,
        priority: 0.75,
        alternates: buildLanguageAlternates((entryLocale) =>
          getIndexableCategories(entryLocale).includes(category)
            ? `/${entryLocale}/${category}`
            : null
        )
      }))
    ),
    ...locales.flatMap((locale) =>
      indexableLegalPageKeys.map((pageKey) => ({
        url: `${baseUrl}${getLegalPagePath(locale, pageKey)}`,
        lastModified: BUILD_DATE,
        changeFrequency: "monthly" as const,
        priority: 0.45,
        alternates: buildLanguageAlternates((entryLocale) =>
          getLegalPagePath(entryLocale, pageKey)
        )
      }))
    ),
    ...locales.flatMap((locale) => {
      const href = buildStorageHubHref(locale);

      if (!href || !getStorageHubContent(locale)) {
        return [];
      }

      return [
        {
          url: `${baseUrl}${href}`,
          lastModified: BUILD_DATE,
          changeFrequency: "weekly" as const,
          priority: 0.78,
          alternates: buildLanguageAlternates((entryLocale) =>
            buildStorageHubHref(entryLocale)
          )
        }
      ];
    })
  ];

  const toolEntries = toolDefinitions.flatMap((definition) =>
    definition.supportedLocales.flatMap((locale) => {
      const localizedContent = (toolContent[locale] ?? {}) as Record<
        string,
        ToolLocaleContent | undefined
      >;
      const content = localizedContent[definition.id];

      if (!content) {
        return [];
      }

      return [
        {
          url: `${baseUrl}/${locale}/${definition.category}/${content.slug}`,
          lastModified: BUILD_DATE,
          changeFrequency: "weekly" as const,
          priority: 0.9,
          alternates: buildLanguageAlternates((entryLocale) => {
            const entryContent = (toolContent[entryLocale] ?? {}) as Record<
              string,
 