import type { Metadata } from "next";
import { toolCategories, type Locale, type ToolCategory } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { isIndexableToolPage } from "@/lib/seo/indexing";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { normalizeMetaTitle } from "@/lib/seo/meta-title";
import { buildSocialMetadata } from "@/lib/seo/social";
import { getIndexableCategories } from "@/lib/tools/categories";
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
  const title = normalizeMetaTitle(content.metaTitle ?? content.seo.title, {
    fallback: content.shortDescription
  });
  const indexable = isIndexableToolPage(definition.id, locale);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords: content.seo.keywords,
    // Strony spoza puli: noindex, follow — Googlebot nadal chodzi po linkach,
    // ale nie zaśmieca indeksu cienkimi/szablonowymi wariantami.
    robots: indexable ? undefined : { index: false, follow: true },
    alternates: {
      canonical,
      // hreflang tylko dla stron indeksowanych — wskazywanie alternatyw dla
      // strony z noindex jest sprzeczne i szkodliwe.
      ...(indexable ? buildAlternates(toolId) : {})
    },
    ...buildSocialMetadata({ title, description, url: canonical, locale })
  };
}

export function buildCategoryAlternates(category: string) {
  if (!toolCategories.includes(category as ToolCategory)) {
    return {};
  }

  const toolCategory = category as ToolCategory;

  return buildLanguageAlternates((locale) =>
    getIndexableCategories(locale).includes(toolCategory)
      ? `/${locale}/${toolCategory}`
      : null
  );
}
