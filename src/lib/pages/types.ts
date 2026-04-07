import type { Locale } from "@/lib/constants";

export const legalPageKeys = [
  "about",
  "privacy",
  "terms",
  "cookies",
  "disclaimer",
  "contact"
] as const;

export type LegalPageKey = (typeof legalPageKeys)[number];

export type LegalPageSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  page: LegalPageKey;
  locale: Locale;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  content: string[];
  sections?: LegalPageSection[];
  keywords: string[];
};
