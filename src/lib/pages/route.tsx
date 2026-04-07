import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import type { Metadata } from "next";
import { LegalPageTemplate } from "@/components/legal/legal-page-template";
import { locales, type Locale } from "@/lib/constants";
import {
  buildLegalPageMetadata,
  getAllLegalPageParams,
  getLegalPageContent
} from "@/lib/pages/legal-content";
import type { LegalPageKey } from "@/lib/pages/types";

export function generateLegalPageStaticParams() {
  return getAllLegalPageParams();
}

export async function generateLegalPageMetadata(
  paramsPromise: Promise<{ locale: Locale }>,
  pageKey: LegalPageKey
): Promise<Metadata> {
  const { locale } = await paramsPromise;

  if (!hasLocale(locales, locale)) {
    return {};
  }

  return buildLegalPageMetadata(locale, pageKey);
}

export async function renderLegalPage(
  paramsPromise: Promise<{ locale: Locale }>,
  pageKey: LegalPageKey
) {
  const { locale } = await paramsPromise;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  const page = await getLegalPageContent(locale, pageKey);

  return <LegalPageTemplate page={page} />;
}
