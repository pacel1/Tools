import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Metadata } from "next";
import { z } from "zod";
import { locales, type Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import {
  legalPageKeys,
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

export function getAllLegalPageParams() {
  return locales.map((locale) => ({ locale }));
}

export function buildLegalPageHref(locale: Locale, pageKey: LegalPageKey) {
  return `/${locale}/${pageKey}`;
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

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((entryLocale) => [
          entryLocale,
          `${getSiteUrl()}${buildLegalPageHref(entryLocale, pageKey)}`
        ])
      )
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonical,
      siteName: getSiteName(),
      locale,
      type: "website"
    }
  };
}
