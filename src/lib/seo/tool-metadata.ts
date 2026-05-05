import type { Metadata } from "next";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { buildToolHref } from "@/lib/tools/internal-linking";
import { getContentById, getDefinitionById } from "@/lib/tools/registry";

export function buildAlternates(toolId: string) {
  const definition = getDefinitionById(toolId);

  if (!definition) {
    return {};
  }

  return buildLanguageAlternates((locale) => {
    const content = getContentById(locale, toolId);

    if (!content) {
      return null;
    }

    return buildToolHref(locale, definition.category, content.slug);
  });
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
  const description = normalizeMetaDescription(
    content.metaDescription ?? content.seo.description,
    content.shortDescription
  );

  return {
    title: content.metaTitle ?? content.seo.title,
    description,
    keywords: content.seo.keywords,
    alternates: {
      canonical,
      ...buildAlternates(toolId)
    },
    openGraph: {
      title: content.metaTitle ?? content.seo.title,
      description,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}

export function buildCategoryAlternates(category: string) {
  return buildLanguageAlternates((locale) => `/${locale}/${category}`);
}
