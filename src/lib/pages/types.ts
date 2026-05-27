import type { Locale } from "@/lib/constants";

export const legalPageKeys = [
  "about",
  "methodology",
  "privacy",
  "terms",
  "cookies",
  "disclaimer",
  "contact"
] as const;

export const noindexLegalPageKeys = ["privacy", "terms", "cookies"] as const;

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

export const legalPageSlugs = {
  about: {
    en: "about",
    pl: "o-nas",
    es: "sobre-nosotros",
    de: "ueber-uns",
    fr: "a-propos"
  },
  methodology: {
    en: "methodology",
    pl: "metodologia",
    es: "metodologia",
    de: "methodik",
    fr: "methodologie"
  },
  privacy: {
    en: "privacy",
    pl: "privacy",
    es: "privacy",
    de: "privacy",
    fr: "privacy"
  },
  terms: {
    en: "terms",
    pl: "terms",
    es: "terms",
    de: "terms",
    fr: "terms"
  },
  cookies: {
    en: "cookies",
    pl: "cookies",
    es: "cookies",
    de: "cookies",
    fr: "cookies"
  },
  disclaimer: {
    en: "disclaimer",
    pl: "zastrzezenia",
    es: "aviso-legal",
    de: "haftungsausschluss",
    fr: "avertissement"
  },
  contact: {
    en: "contact",
    pl: "contact",
    es: "contact",
    de: "contact",
    fr: "contact"
  }
} as const satisfies Record<LegalPageKey, Record<Locale, string>>;

export function getLegalPageSlug(locale: Locale, pageKey: LegalPageKey) {
  return legalPageSlugs[pageKey][locale];
}

export function getLegalPagePath(locale: Locale, pageKey: LegalPageKey) {
  return `/${locale}/${getLegalPageSlug(locale, pageKey)}`;
}
