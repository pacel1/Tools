import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/env";
import {
  buildCategoryCanonical,
  buildCategoryStructuredData,
} from "@/lib/seo/category-hub";
import { buildSocialMetadata } from "@/lib/seo/social";

const htmlTools = [
  {
    id: "html-pretty-print",
    href: "/pl/html-tools/html-pretty-print",
    title: "HTML Pretty Print",
    shortDescription: "Formatuj HTML online.",
    category: "html-tools",
    seoPriority: 1
  },
  {
    id: "html-link-extractor",
    href: "/pl/html-tools/html-link-extractor",
    title: "Ekstraktor linkow HTML",
    shortDescription: "Wyciagaj linki z HTML.",
    category: "html-tools",
    seoPriority: 1
  }
] as const;

describe("category page SEO", () => {
  it("builds canonical metadata for the Polish HTML tools hub", async () => {
    process.env.SITE_URL = "https://www.convertbase.app";

    expect(buildCategoryCanonical("pl", "html-tools")).toBe(
      "https://www.convertbase.app/pl/html-tools"
    );
  });

  it("emits CollectionPage, ItemList and BreadcrumbList structured data", () => {
    process.env.SITE_URL = "https://www.convertbase.app";
    const canonical = `${getSiteUrl()}/pl/html-tools`;
    const structuredData = buildCategoryStructuredData({
      locale: "pl",
      title: "Narzędzia HTML",
      description: "Narzędzia HTML do formatowania i ekstrakcji.",
      canonical,
      tools: [...htmlTools],
      faq: [
        {
          question: "Czy hub HTML jest indeksowalny?",
          answer: "Tak, hub ma canonical, listę narzędzi i FAQ."
        }
      ]
    });

    expect(structuredData.map((item) => item["@type"])).toEqual([
      "BreadcrumbList",
      "CollectionPage",
      "ItemList",
      "FAQPage"
    ]);
    expect(structuredData[1]).toMatchObject({
      "@type": "CollectionPage",
      url: canonical,
      mainEntity: {
        "@type": "ItemList"
      }
    });
  });

  it("builds complete social metadata with a large image card", () => {
    process.env.SITE_URL = "https://www.convertbase.app";
    const social = buildSocialMetadata({
      title: "NarzÄ™dzia HTML",
      description: "NarzÄ™dzia HTML do formatowania i ekstrakcji.",
      url: "https://www.convertbase.app/pl/html-tools",
      locale: "pl"
    });

    expect(social.openGraph).toMatchObject({
      images: [
        {
          width: 1200,
          height: 630
        }
      ]
    });
    expect(String(social.openGraph?.images?.[0].url)).toBe(
      "https://www.convertbase.app/pl/opengraph-image"
    );
    expect(social.twitter).toMatchObject({
      card: "summary_large_image",
      images: [
        {}
      ]
    });
    expect(String(social.twitter?.images?.[0].url)).toBe(
      "https://www.convertbase.app/pl/opengraph-image"
    );
  });
});
