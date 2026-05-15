import path from "node:path";
import { locales, type Locale } from "@/lib/constants";
import type { ToolDefinition, ToolLocaleContent } from "@/lib/tools/types";
import { readJson, writeJson } from "./shared/filesystem";
import { canUseOpenAI, generateStructuredObject } from "./shared/openai";
import { loadToolDefinitions, syncGeneratedArtifacts } from "./shared/registry-writer";
import {
  formatContentQualityIssues,
  pilotToolIds,
  validateContentFiles,
  validateToolContentQuality
} from "./shared/content-quality";

type ContentBundle = Record<Locale, ToolLocaleContent>;

const maxGenerationAttempts = 3;

const contentBundleSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    en: { $ref: "#/$defs/toolContent" },
    pl: { $ref: "#/$defs/toolContent" },
    es: { $ref: "#/$defs/toolContent" },
    de: { $ref: "#/$defs/toolContent" },
    fr: { $ref: "#/$defs/toolContent" }
  },
  required: ["en", "pl", "es", "de", "fr"],
  $defs: {
    useCase: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" }
      },
      required: ["title", "description"]
    },
    example: {
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
    faq: {
      type: "object",
      additionalProperties: false,
      properties: {
        question: { type: "string" },
        answer: { type: "string" }
      },
      required: ["question", "answer"]
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
    },
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
          items: { $ref: "#/$defs/useCase" },
          minItems: 3
        },
        examples: {
          type: "array",
          items: { $ref: "#/$defs/example" },
          minItems: 3
        },
        faq: {
          type: "array",
          items: { $ref: "#/$defs/faq" },
          minItems: 4
        },
        seo: { $ref: "#/$defs/seo" }
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
        "seo"
      ]
    }
  }
};

function parseArgs(args: string[]) {
  const tools = args
    .find((arg) => arg.startsWith("--tools="))
    ?.slice("--tools=".length)
    .split(/[,\s]+/)
    .map((toolId) => toolId.trim())
    .filter(Boolean);
  const limitValue = args.find((arg) => arg.startsWith("--limit="))?.slice("--limit=".length);
  const limit = limitValue ? Number(limitValue) : undefined;
  const offsetValue = args.find((arg) => arg.startsWith("--offset="))?.slice("--offset=".length);
  const offset = offsetValue ? Number(offsetValue) : undefined;
  const after = args.find((arg) => arg.startsWith("--after="))?.slice("--after=".length);

  return {
    after,
    all: args.includes("--all"),
    dryRun: args.includes("--dry-run"),
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
    tools
  };
}

async function readCurrentContent(toolId: string) {
  const content: Partial<Record<Locale, ToolLocaleContent | null>> = {};

  for (const locale of locales) {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "tools",
      "content",
      locale,
      `${toolId}.json`
    );
    try {
      content[locale] = await readJson<ToolLocaleContent>(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
      content[locale] = null;
    }
  }

  return content;
}

async function generateBundle(definition: ToolDefinition, feedback?: string) {
  const currentContent = await readCurrentContent(definition.id);

  return generateStructuredObject<ContentBundle>({
    name: "premium_tool_content_bundle",
    schema: contentBundleSchema,
    system:
      "You rewrite utility-tool page content for a serious SEO-first tools site. Return JSON only. Write every locale natively for local readers, not as literal translation. Keep toolId stable and locale correct. Keep slugs ASCII kebab-case and preserve the existing slug unless it is clearly wrong. metaTitle must be 12-50 characters and must not end with weak words like and, for, with, de, con, do, z, i. metaDescription must be 70-155 characters. Never mention SEO mechanics, long-tail, organic traffic, free online answers, quick checks, common use case, or generic mobile/accuracy FAQ. intro must be a concrete quick answer. overview must be 2-3 useful paragraphs in one string. useCases must be specific title/description cards. examples must have varied realistic inputs and outputs. faq must answer tool-specific doubts, limits, interpretation details, and common mistakes.",
    prompt: JSON.stringify(
      {
        definition,
        currentContent,
        previousValidationFeedback: feedback,
        qualityGate:
          "The output will be rejected if it has generic examples, repeated example inputs, thin overview, missing FAQ depth, weak meta titles, or banned template phrases."
      },
      null,
      2
    )
  });
}

async function writeBundle(toolId: string, bundle: ContentBundle) {
  await Promise.all(
    locales.map((locale) =>
      writeJson(
        path.join(
          process.cwd(),
          "src",
          "data",
          "tools",
          "content",
          locale,
          `${toolId}.json`
        ),
        bundle[locale]
      )
    )
  );
}

function validateBundle(bundle: ContentBundle) {
  return locales.flatMap((locale) => validateToolContentQuality(bundle[locale]));
}

async function generateValidBundle(definition: ToolDefinition) {
  let lastIssues: ReturnType<typeof validateBundle> = [];
  let feedback: string | undefined;

  for (let attempt = 1; attempt <= maxGenerationAttempts; attempt += 1) {
    const bundle = await generateBundle(definition, feedback);
    const issues = validateBundle(bundle);

    if (issues.length === 0) {
      if (attempt > 1) {
        console.log(`Accepted ${definition.id} after ${attempt} attempts.`);
      }
      return bundle;
    }

    lastIssues = issues;
    feedback = formatContentQualityIssues(issues);
    console.warn(
      `Attempt ${attempt}/${maxGenerationAttempts} failed quality validation for ${
        definition.id
      }:\n${formatContentQualityIssues(issues)}`
    );
  }

  throw new Error(
    `Generated content failed quality validation for ${
      definition.id
    } after ${maxGenerationAttempts} attempts:\n${formatContentQualityIssues(lastIssues)}`
  );
}

async function main() {
  if (!canUseOpenAI()) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env before regenerating content.");
  }

  const args = parseArgs(process.argv.slice(2));
  const definitions = await loadToolDefinitions();
  const requestedIds = args.all ? definitions.map((definition) => definition.id) : args.tools;
  const selectedIds = requestedIds?.length ? requestedIds : [...pilotToolIds];
  let selectedDefinitions = selectedIds
    .map((toolId) => {
      const definition = definitions.find((candidate) => candidate.id === toolId);
      if (!definition) {
        throw new Error(`Unknown tool id: ${toolId}`);
      }
      return definition;
    })
    .slice(args.offset ?? 0);

  if (args.after) {
    const afterIndex = selectedDefinitions.findIndex(
      (definition) => definition.id === args.after
    );

    if (afterIndex === -1) {
      throw new Error(`--after tool id was not selected: ${args.after}`);
    }

    selectedDefinitions = selectedDefinitions.slice(afterIndex + 1);
  }

  selectedDefinitions = selectedDefinitions.slice(0, args.limit);
  const changedToolIds: string[] = [];

  for (const definition of selectedDefinitions) {
    console.log(`Regenerating ${definition.id}...`);
    const bundle = await generateValidBundle(definition);

    if (!args.dryRun) {
      await writeBundle(definition.id, bundle);
      changedToolIds.push(definition.id);

      const issues = await validateContentFiles({ toolIds: [definition.id] });
      if (issues.length > 0) {
        throw new Error(
          `Generated content failed quality validation for ${
            definition.id
          }:\n${formatContentQualityIssues(issues)}`
        );
      }
    }
  }

  if (!args.dryRun && changedToolIds.length > 0) {
    await syncGeneratedArtifacts();
  }

  console.log(
    `${args.dryRun ? "Generated preview for" : "Regenerated"} ${
      selectedDefinitions.length
    } tool(s).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
