import { categoryCatalog } from "@/data/categories/catalog";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildToolHref } from "@/lib/tools/internal-linking";
import type { ToolPageModel } from "@/lib/tools/types";

// Etykiety "Home" per-locale dla breadcrumbs
const homeName: Record<Locale, string> = {
  en: "Home",
  pl: "Start",
  es: "Inicio",
  de: "Start",
  fr: "Accueil"
};

export function buildToolStructuredData(locale: Locale, model: ToolPageModel) {
  const canonical = `${getSiteUrl()}${buildToolHref(
    locale,
    model.definition.category,
    model.content.slug
  )}`;
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: homeName[locale],
      item: `${getSiteUrl()}/${locale}`
    },
    {
      "@type": "ListItem",
      position: 2,
      name: categoryCatalog[model.definition.category].label[locale],
      item: `${getSiteUrl()}/${locale}/${model.definition.category}`
    },
    {
      "@type": "ListItem",
      position: 3,
      name: model.content.title,
      item: canonical
    }
  ];

  const toolDescription =
    model.content.metaDescription ?? model.content.seo.description;

  const graphs: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: model.content.h1,
      description: toolDescription,
      url: canonical,
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        name: getSiteName(),
        url: getSiteUrl()
      },
      author: {
        "@type": "Person",
        name: "Paweł Celiński",
        url: `${getSiteUrl()}/en/about`
      },
      publisher: {
        "@type": "Organization",
        name: getSiteName(),
        url: getSiteUrl()
      }
    },
    // SoftwareApplication — daje Google kontekst że to interaktywne narzędzie,
    // co otwiera drogę do rich results dla aplikacji webowych.
    {
      "@context": 