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
import { getLegalPageSlug, type LegalPageKey } from "@/lib/pages/types";

export function generateLegalPageStaticParams(
  pageKey?: LegalPageKey,
  routeSegment?: string
) {
  const params = getAllLegalPageParams();

  if (!pageKey || !routeSegment) {
    return params;
  }

  return params.filter(
    ({ locale }) => getLegalPageSlug(locale, pageKey) === routeSegment
  );
}

export async function generateLegalPageMetadata(
  paramsPromise: Promise<{ locale: Locale }>,
  pageKey: LegalPageKey,
  routeSegment?: string
): Promise<Metadata> {
  const { locale } = await paramsPromise;

  if (!hasLocale(locales, locale)) {
    return {};
  }

  if (routeSegment && getLegalPageSlug(locale, pageKey) !== routeSegment) {
    return {};
  }

  return buildLegalPageMetadata(locale, pageKey);
}

export async function renderLegalPage(
  paramsPromise: Promise<{ locale: Locale }>,
  pageKey: LegalPageKey,
  routeSegment?: string
) {
  const { locale } = await paramsPromise;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  if (routeSegment && getLegalPageSlug(locale, pageKey) !== routeSegment) {
    notFound();
  }

  const page = await getLegalPageContent(locale, pageKey);

  return <LegalPageTemplate page={page} />;
}
