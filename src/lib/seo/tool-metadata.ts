import type { Metadata } from "next";
import type { Locale } from "@/lib/constants";
import { locales } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildToolHref } from "@/lib/tools/internal-linking";
import { getContentById, getDefinitionById } from "@/lib/tools/registry";

export function buildAlternates(toolId: string) {
  const definition = getDefinitionById(toolId);

  if (!definition) {
    return {};
  }

  const languages = Object.fromEntries(
    definition.supportedLocales.flatMap((locale) => {
      const content = getContentById(locale, toolId);

      if (!content) {
        return [];
      }

      return [
        [
          locale,
          `${getSiteUrl()}${buildToolHref(locale, definition.category, content.slug)}`
        ]
      ];
    })
  );

  return { languages };
}

export function buildToolMetadata(toolId: string, locale: Locale): Metadata {
  const definition = getDefinitionById(toolId);
  const content = getContentById(locale, toolId);

  if (!definition || !content) {
    return {};
  }

  const canonical = `${getSiteUrl()}${buildToolHref(
    locale,
    definition.category,
    content.slug
  )}`;

  return {
    title: content.metaTitle ?? content.seo.title,
    description: content.metaDescription ?? content.seo.description,
    keywords: content.seo.keywords,
    alternates: {
      canonical,
      ...buildAlternates(toolId)
    },
    openGraph: {
      title: content.metaTitle ?? content.seo.title,
      description: content.metaDescription ?? content.seo.description,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}

export function buildCategoryAlternates(category: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, `${getSiteUrl()}/${locale}/${category}`])
    )
  };
}
