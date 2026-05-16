import path from "node:path";
import { fileURLToPath } from "node:url";
import { locales, toolCategories, type Locale, type ToolCategory } from "@/lib/constants";
import { getCategoryHubContent, type CategoryHubContent } from "@/lib/tools/discovery";
import { toolDefinitions } from "@/lib/tools/tool-registry.generated";
import { writeJson } from "./shared/filesystem";
import { canUseOpenAI, generateStructuredObject } from "./shared/openai";

type CategoryContentBundle = Record<Locale, CategoryHubContent>;
type CategoryValidationIssue = {
  locale: Locale;
  message: string;
};

const maxGenerationAttempts = 3;

const transliterationMap: Record<string, string> = {
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
  Ł: "L",
  ł: "l",
  Đ: "D",
  đ: "d",
  Þ: "Th",
  þ: "th",
  Æ: "AE",
  æ: "ae",
  Œ: "OE",
  œ: "oe",
  "“": '"',
  "”": '"',
  "„": '"',
  "‘": "'",
  "’": "'",
  "‚": "'",
  "–": "-",
  "—": "-",
  "…": "...",
  "«": '"',
  "»": '"',
  "¿": "?",
  "¡": "!"
};

const nonEnglishLocaleFragments: Record<Exclude<Locale, "en">, string[]> = {
  pl: [
    "which converter",
    "compare file sizes",
    "design and front-end work",
    "travel and daily planning",
    "hardware and product specs"
  ],
  es: [
    "which converter",
    "compare file sizes",
    "change temperature values",
    "match metric",
    "design and front-end work",
    "travel and daily planning",
    "hardware and product specs"
  ],
  de: [
    "which converter",
    "compare file sizes",
    "change temperature values",
    "match metric",
    "design and front-end work",
    "travel and daily planning",
    "hardware and product specs"
  ],
  fr: [
    "which converter",
    "compare file sizes",
    "change temperature values",
    "match metric",
    "design and front-end work",
    "travel and daily planning",
    "hardware and product specs"
  ]
};

const categoryContentSchema = {
  type: "object",
  additionalProperties: false,
  properties: Object.fromEntries(
    locales.map((locale) => [locale, { $ref: "#/$defs/categoryContent" }])
  ),
  required: [...locales],
  $defs: {
    workflow: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        toolId: { type: "string" }
      },
      required: ["title", "description", "toolId"]
    },
    textCard: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        description: { type: "string" }
      },
      required: ["title", "description"]
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
    categoryContent: {
      type: "object",
      additionalProperties: false,
      properties: {
        eyebrow: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        intro: { type: "string" },
        featuredSearches: {
          type: "array",
          items: { type: "string" },
          minItems: 4,
          maxItems: 6
        },
        featuredToolIds: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 6
        },
        workflows: {
          type: "array",
          items: { $ref: "#/$defs/workflow" },
          minItems: 2,
          maxItems: 4
        },
        useCases: {
          type: "array",
          items: { $ref: "#/$defs/textCard" },
          minItems: 2,
          maxItems: 3
        },
        faq: {
          type: "array",
          items: { $ref: "#/$defs/faq" },
          minItems: 2,
          maxItems: 3
        }
      },
      required: [
        "eyebrow",
        "title",
        "description",
        "intro",
        "featuredSearches",
        "featuredToolIds",
        "workflows",
        "useCases",
        "faq"
      ]
    }
  }
};

type GenerateOptions = {
  categories: ToolCategory[];
  outDir?: string;
};

function getToolCount(category: ToolCategory) {
  return toolDefinitions.filter((definition) => definition.category === category).length;
}

function parseOptions(args: string[]): GenerateOptions {
  const category = args
    .find((arg) => arg.startsWith("--category="))
    ?.slice("--category=".length) as ToolCategory | undefined;
  const outDir = args.find((arg) => arg.startsWith("--out-dir="))?.slice("--out-dir=".length);

  if (args.includes("--all")) {
    return {
      categories: toolCategories.filter((candidate) => getToolCount(candidate) > 0),
      outDir
    };
  }

  if (!category || !toolCategories.includes(category)) {
    throw new Error(`Pass --category with one of: ${toolCategories.join(", ")} or use --all.`);
  }

  if (getToolCount(category) === 0) {
    throw new Error(`Category "${category}" has no tools, so content generation would be thin.`);
  }

  return { categories: [category], outDir };
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }

  return [];
}

function hasOnlyAscii(value: string) {
  return Array.from(value).every((character) => {
    const code = character.charCodeAt(0);

    return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
  });
}

export function toAscii(value: string) {
  const normalized = Array.from(value)
    .map((character) => transliterationMap[character] ?? character)
    .join("")
    .normalize("NFD")
    .replace(/\p{Mark}/gu, "");

  return Array.from(normalized)
    .filter((character) => {
      const code = character.charCodeAt(0);

      return code === 9 || code === 10 || code === 13 || (code >= 32 && code <= 126);
    })
    .join("");
}

export function sanitizeVisibleText<T>(value: T): T {
  if (typeof value === "string") {
    return toAscii(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeVisibleText(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeVisibleText(item)])
    ) as T;
  }

  return value;
}

function validateCategoryContent(category: ToolCategory, bundle: CategoryContentBundle) {
  const issues: CategoryValidationIssue[] = [];
  const categoryDefinitions = toolDefinitions.filter((definition) => definition.category === category);
  const validToolIds = new Set(categoryDefinitions.map((definition) => definition.id));
  const minimumToolRefs = Math.min(3, validToolIds.size);

  for (const locale of locales) {
    const content = bundle[locale];
    const text = JSON.stringify(content).toLowerCase();

    if (wordCount(content.description) < 8) {
      issues.push({ locale, message: "description is too short." });
    }

    if (wordCount(content.intro) < 14) {
      issues.push({ locale, message: "intro is too short." });
    }

    if (content.featuredSearches.length < 4) {
      issues.push({ locale, message: "at least 4 featured searches are required." });
    }

    if (content.featuredToolIds.length < minimumToolRefs) {
      issues.push({
        locale,
        message: `at least ${minimumToolRefs} featured tool IDs are required.`
      });
    }

    if (content.workflows.length < Math.min(2, validToolIds.size)) {
      issues.push({
        locale,
        message: "not enough workflows for the available category tools."
      });
    }

    if (text.includes("long-tail") || text.includes("organic traffic")) {
      issues.push({ locale, message: "contains SEO-template phrasing." });
    }

    for (const value of collectStrings(content)) {
      if (!hasOnlyAscii(value)) {
        issues.push({
          locale,
          message: `non-ASCII visible text found: "${value.slice(0, 80)}"`
        });
        break;
      }
    }

    if (locale !== "en") {
      const forbiddenFragments = nonEnglishLocaleFragments[locale];

      for (const fragment of forbiddenFragments) {
        if (text.includes(fragment)) {
          issues.push({
            locale,
            message: `non-${locale} visible prose appears to contain English fragment: "${fragment}".`
          });
        }
      }
    }

    for (const toolId of [...content.featuredToolIds, ...content.workflows.map((item) => item.toolId)]) {
      if (!validToolIds.has(toolId)) {
        issues.push({
          locale,
          message: `unknown or wrong-category tool id "${toolId}".`
        });
      }
    }
  }

  return issues;
}

function formatValidationIssues(issues: CategoryValidationIssue[]) {
  return issues.map((issue) => `${issue.locale}: ${issue.message}`).join("\n");
}

async function requestCategoryBundle(category: ToolCategory, feedback?: string) {
  const currentContent = Object.fromEntries(
    locales.map((locale) => [locale, getCategoryHubContent(locale, category)])
  );
  const categoryTools = toolDefinitions
    .filter((definition) => definition.category === category)
    .map((definition) => ({
      id: definition.id,
      category: definition.category,
      supportedLocales: definition.supportedLocales,
      seoPriority: definition.seoPriority
    }));

  return generateStructuredObject<CategoryContentBundle>({
    name: "category_content_bundle",
    schema: categoryContentSchema,
    system:
      "Generate native, useful category hub content for a serious online tools site. Return JSON only. All visible strings must be ASCII-only: transliterate accented characters, Polish diacritics, German umlauts and punctuation such as curly quotes into plain ASCII. Do not mention SEO mechanics, long-tail, organic traffic, or generic free-online-tool language. featuredSearches must be real search intents, not just tool titles. Workflows must explain when to choose specific tools. Use only tool IDs provided in the prompt.",
    prompt: JSON.stringify(
      {
        category,
        categoryTools,
        currentContent,
        previousValidationFeedback: feedback,
        qualityGate:
          "Reject thin category copy, repeated phrasing across locales, invalid tool IDs, non-ASCII visible text, generic FAQ, and English prose left in non-English locales. Tool IDs stay unchanged, but all visible prose and search phrases must be native to each locale."
      },
      null,
      2
    )
  });
}

async function generateCategoryBundle(category: ToolCategory) {
  let feedback: string | undefined;
  let lastIssues: CategoryValidationIssue[] = [];

  for (let attempt = 1; attempt <= maxGenerationAttempts; attempt += 1) {
    const bundle = sanitizeVisibleText(await requestCategoryBundle(category, feedback));
    const issues = validateCategoryContent(category, bundle);

    if (issues.length === 0) {
      return bundle;
    }

    lastIssues = issues;
    feedback = formatValidationIssues(issues);
    console.error(
      `Attempt ${attempt}/${maxGenerationAttempts} failed validation for ${category}:\n${feedback}`
    );
  }

  throw new Error(
    `Generated category content failed validation after ${maxGenerationAttempts} attempts:\n${formatValidationIssues(
      lastIssues
    )}`
  );
}

async function main() {
  if (!canUseOpenAI()) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env before generating category content.");
  }

  const options = parseOptions(process.argv.slice(2));
  const output: Partial<Record<ToolCategory, CategoryContentBundle>> = {};

  for (const category of options.categories) {
    console.error(`Generating category content for ${category}...`);
    const bundle = await generateCategoryBundle(category);
    output[category] = bundle;

    if (options.outDir) {
      await writeJson(`${options.outDir}/${category}.json`, bundle);
    }
  }

  console.log(JSON.stringify(options.categories.length === 1 ? output[options.categories[0]] : output, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
