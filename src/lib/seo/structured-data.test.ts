import { describe, expect, it } from "vitest";
import { buildToolStructuredData } from "@/lib/seo/structured-data";
import type { ToolPageModel } from "@/lib/tools/types";

describe("tool structured data", () => {
  it("uses WebPage schema instead of SoftwareApplication without real reviews", () => {
    process.env.SITE_URL = "https://www.convertbase.app";
    const model = {
      definition: {
        id: "html-formatter",
        type: "developer-tool",
        category: "html-tools",
        componentName: "HtmlFormatterTool",
        logicModule: "html-tools",
        inputSchema: "HtmlFormatterInput",
        outputSchema: "HtmlFormatterOutput",
        supportedLocales: ["pl"],
        relatedTools: [],
        seoPriority: 1
      },
      content: {
        toolId: "html-formatter",
        locale: "pl",
        slug: "formatowanie-html",
        h1: "Formatowanie HTML online",
        title: "Formatowanie HTML online",
        shortDescription: "Formatuj kod HTML online.",
        metaDescription: "Formatuj kod HTML online w ConvertBase.app.",
        overview: "Narzędzie formatuje kod HTML.",
        howItWorks: ["Wklej kod HTML.", "Uruchom formatowanie."],
        examples: [],
        faq: [
          {
            question: "Czy formatter HTML jest darmowy?",
            answer: "Tak, narzędzie działa bezpłatnie w przeglądarce."
          }
        ],
        seo: {
          title: "Formatowanie HTML online",
          description: "Formatuj kod HTML online w ConvertBase.app.",
          keywords: ["html", "formatter"]
        }
      }
    } satisfies ToolPageModel;

    const structuredData = buildToolStructuredData("pl", model);
    const types = structuredData.map((item) => item["@type"]);

    expect(types).not.toContain("SoftwareApplication");
    expect(types).toContain("WebPage");
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
    expect(structuredData[0]).toMatchObject({
      "@type": "WebPage",
      url: "https://www.convertbase.app/pl/html-tools/formatowanie-html",
      isPartOf: {
        "@type": "WebSite",
        name: "ConvertBase.app",
        url: "https://www.convertbase.app"
      },
      publisher: {
        "@type": "Organization",
        name: "ConvertBase.app"
      }
    });
  });
});
