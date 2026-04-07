import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { legalPageKeys } from "@/lib/pages/types";
import { getAllToolDefinitions, getContentById } from "@/lib/tools/registry";
import { locales, toolCategories } from "@/lib/constants";

function buildLanguageAlternates(
  getPath: (locale: (typeof locales)[number]) => string | null
) {
  return {
    languages: Object.fromEntries(
      locales.flatMap((locale) => {
        const path = getPath(locale);

        if (!path) {
          return [];
        }

        return [[locale, `${getSiteUrl()}${path}`]];
      })
    )
  };
}

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
    )
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
