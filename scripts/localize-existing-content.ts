import path from "node:path";
import { locales, type Locale } from "@/lib/constants";
import type { ToolLocaleContent } from "@/lib/tools/types";
import { listJsonFiles, readJson, writeJson } from "./shared/filesystem";
import { canUseOpenAI, generateStructuredObject } from "./shared/openai";

type TargetLocale = Exclude<Locale, "en">;

type LocalizedBundle = Record<TargetLocale, ToolLocaleContent>;

const localizedContentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pl: { $ref: "#/$defs/toolContent" },
    es: { $ref: "#/$defs/toolContent" },
    de: { $ref: "#/$defs/toolContent" },
    fr: { $ref: "#/$defs/toolContent" }
  },
  required: ["pl", "es", "de", "fr"],
  $defs: {
    toolContent: {
      type: "object",
      additionalProperties: false,
      properties: {
        toolId: { type: "string" },
        locale: { type: "string" },
        slug: { type: "string" },
        h1: { type: "string" },
        title: { type: "string" },
        shortDescription: { type: "string" },
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
        intro: { type: "string" },
        overview: { type: "string" },
        howItWorks: {
          type: "array",
          items: { type: "string" },
          minItems: 3
        },
        useCases: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "description"]
          },
          minItems: 3
        },
        examples: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              input: { type: "string" },
              output: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "input", "output", "description"]
          },
          minItems: 3
        },
        faq: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              answer: { type: "string" }
            },
            required: ["question", "answer"]
          },
          minItems: 4
        },
        uiLabels: {
          type: "object",
          additionalProperties: false,
          properties: {
            copy: { type: "string" },
            copied: { type: "string" },
            input: { type: "string" },
            output: { type: "string" },
            placeholder: { type: "string" },
            indent: { type: "string" },
            removeComments: { type: "string" },
            preview: { type: "string" },
            source: { type: "string" },
            sanitizedHtml: { type: "string" },
            plainText: { type: "string" },
            summary: { type: "string" },
            total: { type: "string" },
            links: { type: "string" },
            images: { type: "string" },
            errors: { type: "string" },
            warnings: { type: "string" },
            valid: { type: "string" },
            invalid: { type: "string" },
            href: { type: "string" },
            text: { type: "string" },
            rel: { type: "string" },
            target: { type: "string" },
            alt: { type: "string" },
            width: { type: "string" },
            height: { type: "string" },
            empty: { type: "string" },
            outputReady: { type: "string" },
            cleanedHtml: { type: "string" },
            formattedHtml: { type: "string" },
            minifiedHtml: { type: "string" },
            markdown: { type: "string" },
            extractedImages: { type: "string" },
            extractedLinks: { type: "string" },
            validationSummary: { type: "string" },
            prettyHtml: { type: "string" },
            encodedText: { type: "string" }
          },
          required: [
            "copy",
            "copied",
            "input",
            "output",
            "placeholder",
            "indent",
            "removeComments",
            "preview",
            "source",
            "sanitizedHtml",
            "plainText",
            "summary",
            "total",
            "links",
            "images",
            "errors",
            "warnings",
            "valid",
            "invalid",
            "href",
            "text",
            "rel",
            "target",
            "alt",
            "width",
            "height",
            "empty",
            "outputReady",
            "cleanedHtml",
            "formattedHtml",
            "minifiedHtml",
            "markdown",
            "extractedImages",
            "extractedLinks",
            "validationSummary",
            "prettyHtml",
            "encodedText"
          ]
        },
        seo: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            keywords: {
              type: "array",
              items: { type: "string" },
              minItems: 3
            }
          },
          required: ["title", "description", "keywords"]
        }
      },
      required: [
        "toolId",
        "locale",
        "slug",
        "h1",
        "title",
        "shortDescription",
        "metaTitle",
        "metaDescription",
        "intro",
        "overview",
        "howItWorks",
        "useCases",
        "examples",
        "faq",
        "uiLabels",
        "seo"
      ]
    }
  }
};

async function localizeToolContent({
  toolId,
  definition,
  englishContent
}: {
  toolId: string;
  definition: Record<string, unknown>;
  englishContent: ToolLocaleContent;
}) {
  return generateStructuredObject<LocalizedBundle>({
    name: "localized_tool_content_bundle",
    schema: localizedContentSchema,
    system:
      "You create native localized utility-tool page content for end users. Return JSON only. Use the English content and definition as context, but write pl, es, de and fr directly for local readers rather than translating word-for-word. Localize title, h1, shortDescription, metaTitle, metaDescription, intro, overview, useCases, examples, faq, seo.title and seo.description. metaTitle must be 12-50 characters and must not end with weak words like and, for, with, de, con, do, z, i. metaDescription must be 70-155 characters. For non-English locales, translate the tool name naturally whenever a clear local equivalent exists. Generate localized ASCII-only slugs in kebab-case. Keep toolId unchanged and set locale correctly for each object. Avoid template SEO language such as long-tail, organic traffic, free online answer, quick checks, common use case, and generic mobile/accuracy FAQ. intro must give a concrete quick answer. overview must be 2-3 practical paragraphs in one string. useCases must be specific title/description cards. examples must use varied realistic inputs and outputs. faq must answer tool-specific doubts, limits and interpretation details. Preserve or add uiLabels when useful for form fields and result labels.",
    prompt: JSON.stringify(
      {
        toolId,
        definition,
        englishContent
      },
      null,
      2
    )
  });
}

async function main() {
  if (!canUseOpenAI()) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const root = process.cwd();
  const definitionsDir = path.join(root, "src", "data", "tools", "definitions");
  const definitionFiles = await listJsonFiles(definitionsDir);

  for (const definitionFile of definitionFiles) {
    const definition = await readJson<Record<string, unknown>>(definitionFile);
    const toolId = path.basename(definitionFile, ".json");
    const englishContent = await readJson<ToolLocaleContent>(
      path.join(root, "src", "data", "tools", "content", "en", `${toolId}.json`)
    );

    console.log(`Localizing ${toolId}...`);
    const localized = await localizeToolContent({ toolId, definition, englishContent });

    await Promise.all(
      locales
        .filter((locale): locale is TargetLocale => locale !== "en")
        .map((locale) =>
          writeJson(
            path.join(root, "src", "data", "tools", "content", locale, `${toolId}.json`),
            localized[locale]
          )
        )
    );
  }

  console.log(`Localized content for ${definitionFiles.length} tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
