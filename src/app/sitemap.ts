import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { legalPageKeys } from "@/lib/pages/types";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { buildStorageHubHref, getStorageHubContent } from "@/lib/tools/discovery";
import { getAllToolDefinitions, getContentById } from "@/lib/tools/registry";
import { locales, toolCategories } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticEntries = [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: buildLanguageAlternates((entryLocale) => `/${entryLocale}`)
    })),
    ...locales.flatMap((locale) =>
      toolCategories.map((category) => ({
        url: `${baseUrl}/${locale}/${category}`,
        changeFrequency: "weekly" as const,
        priority: 0.75,
        alternates: buildLanguageAlternates(
          (entryLocale) => `/${entryLocale}/${category}`
        )
      }))
    ),
    ...locales.flatMap((locale) =>
      legalPageKeys.map((pageKey) => ({
        url: `${baseUrl}/${locale}/${pageKey}`,
        changeFrequency: "monthly" as const,
        priority: 0.45,
        alternates: buildLanguageAlternates(
          (entryLocale) => `/${entryLocale}/${pageKey}`
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
          changeFrequency: "weekly" as const,
          priority: 0.78,
          alternates: buildLanguageAlternates((entryLocale) => buildStorageHubHref(entryLocale))
        }
      ];
    })
  ];

  const toolEntries = getAllToolDefinitions().flatMap((definition) =>
    definition.supportedLocales.flatMap((locale) => {
      const content = getContentById(locale, definition.id);

      if (!content) {
        return [];
      }

      return [
        {
          url: `${baseUrl}/${locale}/${definition.category}/${content.slug}`,
          changeFrequency: "weekly" as const,
          priority: 0.9,
          alternates: buildLanguageAlternates((entryLocale) => {
            const localizedContent = getContentById(entryLocale, definition.id);

            if (!localizedContent) {
              return null;
            }

            return `/${entryLocale}/${definition.category}/${localizedContent.slug}`;
          })
        }
      ];
    })
  );

  return [...staticEntries, ...toolEntries];
}
