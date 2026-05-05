import type { Locale, ToolCategory } from "@/lib/constants";
import { getSiteName, getSiteUrl } from "@/lib/env";
import type { CategoryHubContent } from "@/lib/tools/discovery";

export type CategoryStructuredTool = {
  href: string;
  title: string;
};

export function buildCategoryCanonical(locale: Locale, category: ToolCategory) {
  return `${getSiteUrl()}/${locale}/${category}`;
}

export function buildCategoryStructuredData({
  locale,
  title,
  description,
  canonical,
  tools,
  faq
}: {
  locale: Locale;
  title: string;
  description: string;
  canonical: string;
  tools: CategoryStructuredTool[];
  faq: CategoryHubContent["faq"];
}) {
  const homeLabel = locale === "de" || locale === "pl" ? "Start" : "Home";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: tools.slice(0, 12).map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${getSiteUrl()}${tool.href}`,
      name: tool.title
    }))
  };

  const structuredData: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: homeLabel,
          item: `${getSiteUrl()}/${locale}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: canonical
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title,
      description,
      url: canonical,
      inLanguage: locale,
      isPartOf: {
        "@type": "WebSite",
        name: getSiteName(),
        url: getSiteUrl()
      },
      mainEntity: itemList
    },
    itemList
  ];

  if (faq.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }

  return structuredData;
}
