import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import { z } from "zod";
import { locales, type Locale } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";
import { buildLanguageAlternates } from "@/lib/seo/alternates";
import { normalizeMetaDescription } from "@/lib/seo/meta-description";
import { normalizeMetaTitle } from "@/lib/seo/meta-title";
import { buildSocialMetadata } from "@/lib/seo/social";
import {
  legalPageKeys,
  noindexLegalPageKeys,
  getLegalPagePath,
  type LegalPageContent,
  type LegalPageKey
} from "@/lib/pages/types";

const legalPageSectionSchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1)
});

const legalPageContentSchema = z.object({
  page: z.enum(legalPageKeys),
  locale: z.enum(locales),
  title: z.string().min(1),
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  heading: z.string().min(1),
  content: z.array(z.string().min(1)).min(1),
  sections: z.array(legalPageSectionSchema).default([]),
  keywords: z.array(z.string().min(1)).min(1)
});

const contentRoot = path.join(process.cwd(), "content", "pages");
const noindexLegalPageKeySet = new Set<LegalPageKey>(noindexLegalPageKeys);

export function getAllLegalPageParams() {
  return locales.map((locale) => ({ locale }));
}

export function buildLegalPageHref(locale: Locale, pageKey: LegalPageKey) {
  return getLegalPagePath(locale, pageKey);
}

export const getLegalPageContent = cache(
  async (locale: Locale, pageKey: LegalPageKey): Promise<LegalPageContent> => {
    const filePath = path.join(contentRoot, locale, `${pageKey}.json`);
    const file = await readFile(filePath, "utf8");
    return legalPageContentSchema.parse(JSON.parse(file));
  }
);

export async function buildLegalPageMetadata(
  locale: Locale,
  pageKey: LegalPageKey
): Promise<Metadata> {
  const page = await getLegalPageContent(locale, pageKey);
  const canonical = `${getSiteUrl()}${buildLegalPageHref(locale, pageKey)}`;
  const shouldNoindex = noindexLegalPageKeySet.has(pageKey);
  const description = normalizeMetaDescription(
    page.metaDescription,
    page.content[0] ?? page.title
  );
  const title = normalizeMetaTitle(page.metaTitle, { reserveSiteName: false });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      absolute: title
    },
    description,
    keywords: page.keywords,
    robots: shouldNoindex
      ? {
          index: false,
          follow: true
        }
      : {
          index: true,
          follow: true
        },
    alternates: shouldNoindex
      ? {
          canonical
        }
      : {
          canonical,
          ...buildLanguageAlternates((entryLocale) =>
            buildLegalPageHref(entryLocale, pageKey)
          )
        },
    ...buildSocialMetadata({
      title,
      description,
      url: canonical,
      locale
    })
  };
}
