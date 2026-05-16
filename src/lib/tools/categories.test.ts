import { describe, expect, it } from "vitest";
import { locales, toolCategories } from "@/lib/constants";
import {
  getIndexableCategories,
  minimumIndexableCategoryToolCount
} from "@/lib/tools/categories";
import { getCategoryHubContent } from "@/lib/tools/discovery";
import { toolContent } from "@/lib/tools/tool-content.generated";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import type { ToolLocaleContent } from "@/lib/tools/types";

const forbiddenCategoryPhrases = [
  "free online answer",
  "long-tail",
  "organic traffic",
  "sa dobrymi punktami",
  "common use case"
];

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function getCategoryToolCount(locale: (typeof locales)[number], category: string) {
  const localizedContent = (toolContent[locale] ?? {}) as Record<
    string,
    ToolLocaleContent | undefined
  >;

  return toolDefinitions.filter(
    (definition) =>
      definition.category === category &&
      definition.supportedLocales.includes(locale) &&
      localizedContent[definition.id]
  ).length;
}

describe("category hub quality", () => {
  it("only indexes categories with curated hub content and enough tools", () => {
    for (const locale of locales) {
      for (const category of getIndexableCategories(locale)) {
        expect(getCategoryHubContent(locale, category)).toBeTruthy();
        expect(getCategoryToolCount(locale, category)).toBeGreaterThanOrEqual(
          minimumIndexableCategoryToolCount
        );
      }
    }
  });

  it("indexes security hubs once they have enough tools", () => {
    for (const locale of locales) {
      expect(getCategoryToolCount(locale, "security-tools")).toBeGreaterThanOrEqual(
        minimumIndexableCategoryToolCount
      );
      expect(getIndexableCategories(locale)).toContain("security-tools");
    }
  });

  it("indexes generated category hubs for non-priority locales once content is available", () => {
    expect(getCategoryHubContent("es", "converters")).toBeTruthy();
    expect(getCategoryHubContent("fr", "calculators")).toBeTruthy();
    expect(getIndexableCategories("es")).toContain("converters");
    expect(getIndexableCategories("fr")).toContain("calculators");
  });

  it("has complete non-template content for every indexable category", () => {
    for (const locale of locales) {
      for (const category of getIndexableCategories(locale)) {
        const hub = getCategoryHubContent(locale, category);

        expect(hub, `${locale}/${category}`).toBeTruthy();
        expect(wordCount(hub!.description), `${locale}/${category} description`).toBeGreaterThan(7);
        expect(wordCount(hub!.intro), `${locale}/${category} intro`).toBeGreaterThan(12);
        expect(hub!.featuredSearches.length, `${locale}/${category} searches`).toBeGreaterThanOrEqual(4);
        expect(hub!.workflows.length, `${locale}/${category} workflows`).toBeGreaterThanOrEqual(2);
        expect(hub!.faq.length, `${locale}/${category} faq`).toBeGreaterThanOrEqual(2);

        const text = JSON.stringify(hub).toLowerCase();
        for (const phrase of forbiddenCategoryPhrases) {
          expect(text, `${locale}/${category} forbidden phrase ${phrase}`).not.toContain(phrase);
        }
      }
    }
  });

  it("does not expose active categories without a hub decision", () => {
    for (const locale of locales) {
      for (const category of toolCategories) {
        const tools = getCategoryToolCount(locale, category);

        if (tools === 0) {
          continue;
        }

        expect(getCategoryHubContent(locale, category), `${locale}/${category}`).toBeTruthy();
      }
    }
  });
});
