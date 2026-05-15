import path from "node:path";
import type { Locale } from "@/lib/constants";
import type { ToolDefinition, ToolLocaleContent, ToolUseCase } from "@/lib/tools/types";
import { listJsonFiles, readJson } from "./filesystem";

export const pilotToolIds = ["sales-tax-calculator", "base64-encoder"] as const;

export type ContentQualityIssue = {
  toolId: string;
  locale?: Locale;
  field?: string;
  message: string;
};

const forbiddenPhrases = [
  "another quick example",
  "can i use this tool on mobile",
  "common use case",
  "darmowej odpowiedzi online",
  "długich fraz",
  "długiego ogona",
  "free online answer",
  "how accurate is this tool",
  "long tail",
  "long-tail",
  "longue traine",
  "longue traîne",
  "organic traffic",
  "ruch organiczny",
  "szybkich wyników w przeglądarce",
  "trafic organique"
];

const genericExampleTitlePatterns = [
  /^another quick example$/i,
  /^beispiel\s+\d+$/i,
  /^common use case$/i,
  /^example\s+\d+$/i,
  /^exemple\s+\d+$/i,
  /^przykład\s+\d+$/i
];

const genericFaqFragments = [
  "can i use this tool on mobile",
  "czy mogę używać tego narzędzia na telefonie",
  "how accurate is this tool",
  "jak dokładne jest to narzędzie",
  "kann ich dieses tool auf dem smartphone nutzen",
  "quelle est la précision de cet outil"
];

const weakTitleEndings = [
  "a",
  "and",
  "avec",
  "con",
  "de",
  "do",
  "dla",
  "en",
  "for",
  "für",
  "i",
  "of",
  "to",
  "und",
  "with",
  "z"
];

function collectText(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectText);
  }

  return [];
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function endsWithWeakWord(value: string) {
  const words = value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const last = words.at(-1)?.replace(/[^\p{L}\p{N}]+/gu, "");

  return Boolean(last && weakTitleEndings.includes(last));
}

function validateMetaText(
  issues: ContentQualityIssue[],
  content: ToolLocaleContent,
  field: "metaTitle" | "metaDescription",
  value: string | undefined,
  { min, max }: { min: number; max: number }
) {
  if (!value) {
    pushIssue(issues, content, field, `${field} is required for pilot-quality content.`);
    return;
  }

  if (value.length < min || value.length > max) {
      pushIssue(issues, content, field, `${field} must be ${min}-${max} characters.`);
  }

  if (field === "metaTitle" && endsWithWeakWord(value)) {
    pushIssue(issues, content, field, "metaTitle ends with a weak word that may look bad when truncated.");
  }
}

function normalizeUseCase(item: string | ToolUseCase): ToolUseCase {
  if (typeof item === "string") {
    return { title: item, description: item };
  }

  return item;
}

function pushIssue(
  issues: ContentQualityIssue[],
  content: Pick<ToolLocaleContent, "toolId" | "locale">,
  field: string,
  message: string
) {
  issues.push({
    toolId: content.toolId,
    locale: content.locale,
    field,
    message
  });
}

export function validateToolContentQuality(content: ToolLocaleContent) {
  const issues: ContentQualityIssue[] = [];
  const allText = collectText(content).join("\n").toLowerCase();

  validateMetaText(issues, content, "metaTitle", content.metaTitle, { min: 12, max: 50 });
  validateMetaText(issues, content, "metaDescription", content.metaDescription, {
    min: 70,
    max: 155
  });

  for (const phrase of forbiddenPhrases) {
    if (allText.includes(phrase.toLowerCase())) {
      pushIssue(issues, content, "content", `Forbidden template phrase: "${phrase}"`);
    }
  }

  if (!content.intro || wordCount(content.intro) < 6) {
    pushIssue(issues, content, "intro", "Intro must be specific and at least 6 words.");
  }

  if (wordCount(content.overview) < 45) {
    pushIssue(issues, content, "overview", "Overview must be at least 45 words.");
  }

  const useCases = content.useCases?.map(normalizeUseCase) ?? [];

  if (useCases.length < 3) {
    pushIssue(issues, content, "useCases", "At least 3 use cases are required.");
  }

  for (const [index, useCase] of useCases.entries()) {
    if (useCase.title.trim().length < 6 || wordCount(useCase.description) < 8) {
      pushIssue(
        issues,
        content,
        `useCases[${index}]`,
        "Use case cards need a clear title and a specific description."
      );
    }
  }

  if (content.examples.length < 3) {
    pushIssue(issues, content, "examples", "At least 3 examples are required.");
  }

  const exampleInputs = new Set<string>();
  for (const [index, example] of content.examples.entries()) {
    if (genericExampleTitlePatterns.some((pattern) => pattern.test(example.title.trim()))) {
      pushIssue(issues, content, `examples[${index}].title`, "Example title is generic.");
    }

    if (exampleInputs.has(example.input.trim().toLowerCase())) {
      pushIssue(issues, content, `examples[${index}].input`, "Example input is repeated.");
    }

    exampleInputs.add(example.input.trim().toLowerCase());

    if (wordCount(example.description) < 5) {
      pushIssue(
        issues,
        content,
        `examples[${index}].description`,
        "Example description must explain the realistic scenario."
      );
    }
  }

  if (content.faq.length < 4) {
    pushIssue(issues, content, "faq", "At least 4 tool-specific FAQ items are required.");
  }

  for (const [index, faq] of content.faq.entries()) {
    const question = faq.question.trim().toLowerCase();
    if (genericFaqFragments.some((fragment) => question.includes(fragment))) {
      pushIssue(issues, content, `faq[${index}].question`, "FAQ question is generic.");
    }

    if (wordCount(faq.answer) < 8) {
      pushIssue(issues, content, `faq[${index}].answer`, "FAQ answer is too short.");
    }
  }

  if (content.seo.keywords.length < 3) {
    pushIssue(issues, content, "seo.keywords", "At least 3 SEO keywords are required.");
  }

  return issues;
}

export async function validateContentFiles({
  root = process.cwd(),
  toolIds = [...pilotToolIds]
}: {
  root?: string;
  toolIds?: string[];
} = {}) {
  const definitionsDir = path.join(root, "src", "data", "tools", "definitions");
  const definitionFiles = await listJsonFiles(definitionsDir);
  const definitions = await Promise.all(
    definitionFiles.map((file) => readJson<ToolDefinition>(file))
  );
  const selectedDefinitions = definitions.filter((definition) =>
    toolIds.includes(definition.id)
  );
  const issues: ContentQualityIssue[] = [];

  for (const toolId of toolIds) {
    if (!selectedDefinitions.some((definition) => definition.id === toolId)) {
      issues.push({ toolId, message: "Tool definition was not found." });
    }
  }

  for (const definition of selectedDefinitions) {
    for (const locale of definition.supportedLocales) {
      const contentPath = path.join(
        root,
        "src",
        "data",
        "tools",
        "content",
        locale,
        `${definition.id}.json`
      );

      let content: ToolLocaleContent;
      try {
        content = await readJson<ToolLocaleContent>(contentPath);
      } catch {
        issues.push({
          toolId: definition.id,
          locale,
          message: `Missing content file: ${contentPath}`
        });
        continue;
      }

      if (content.toolId !== definition.id) {
        pushIssue(issues, content, "toolId", "toolId does not match definition id.");
      }

      if (content.locale !== locale) {
        pushIssue(issues, content, "locale", "locale does not match content directory.");
      }

      issues.push(...validateToolContentQuality(content));
    }
  }

  return issues;
}

export function formatContentQualityIssues(issues: ContentQualityIssue[]) {
  return issues
    .map((issue) => {
      const location = [issue.toolId, issue.locale, issue.field].filter(Boolean).join(":");
      return `- ${location || issue.toolId}: ${issue.message}`;
    })
    .join("\n");
}
