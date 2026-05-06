import { categoryCatalog } from "@/data/categories/catalog";
import type { Locale } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import { buildToolHref } from "@/lib/tools/internal-linking";
import type { ToolPageModel } from "@/lib/tools/types";

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
      name: locale === "pl" ? "Start" : locale === "de" ? "Start" : "Home",
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

  const graphs: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: model.content.h1,
      description: model.content.metaDescription ?? model.content.seo.description,
      url: canonical,
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        name: getSiteName(),
        url: getSiteUrl()
      },
      publisher: {
        "@type": "Organization",
        name: getSiteName()
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems
    }
  ];

  if (model.content.faq.length) {
    graphs.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: model.content.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }

  return graphs;
}
