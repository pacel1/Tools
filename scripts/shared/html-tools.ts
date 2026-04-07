import { locales } from "@/lib/constants";
import {
  normalizeDefinition,
  toCamelCase,
  toPascalCase,
  type AddToolDefinition,
  type ToolCodeArtifacts
} from "./definitions";

type HtmlSeed = {
  id: string;
  title: string;
  shortDescription: string;
  seoPriority: number;
  inputLabel: string;
  outputLabel: string;
  inputKind: "html" | "markdown" | "text";
};

const htmlSeeds: HtmlSeed[] = [
  {
    id: "html-formatter",
    title: "HTML Formatter",
    shortDescription: "Format messy HTML with readable indentation and clean structure.",
    seoPriority: 0.93,
    inputLabel: "HTML input",
    outputLabel: "Formatted HTML",
    inputKind: "html"
  },
  {
    id: "html-minifier",
    title: "HTML Minifier",
    shortDescription: "Minify HTML online to reduce file size without calling external APIs.",
    seoPriority: 0.92,
    inputLabel: "HTML input",
    outputLabel: "Minified HTML",
    inputKind: "html"
  },
  {
    id: "html-viewer",
    title: "HTML Viewer",
    shortDescription: "Preview sanitized HTML safely and inspect the cleaned source.",
    seoPriority: 0.9,
    inputLabel: "HTML input",
    outputLabel: "Sanitized HTML",
    inputKind: "html"
  },
  {
    id: "html-to-text",
    title: "HTML to Text",
    shortDescription: "Extract readable plain text from HTML snippets and full documents.",
    seoPriority: 0.91,
    inputLabel: "HTML input",
    outputLabel: "Plain text",
    inputKind: "html"
  },
  {
    id: "html-escape",
    title: "HTML Escape",
    shortDescription: "Escape reserved HTML characters for safe embedding in code and content.",
    seoPriority: 0.87,
    inputLabel: "Text input",
    outputLabel: "Escaped HTML",
    inputKind: "text"
  },
  {
    id: "html-unescape",
    title: "HTML Unescape",
    shortDescription: "Decode escaped HTML entities back into readable markup or text.",
    seoPriority: 0.87,
    inputLabel: "Escaped text",
    outputLabel: "Unescaped text",
    inputKind: "text"
  },
  {
    id: "html-to-markdown",
    title: "HTML to Markdown",
    shortDescription: "Convert HTML into Markdown for docs, CMS workflows and content cleanup.",
    seoPriority: 0.9,
    inputLabel: "HTML input",
    outputLabel: "Markdown output",
    inputKind: "html"
  },
  {
    id: "markdown-to-html",
    title: "Markdown to HTML",
    shortDescription: "Convert Markdown into sanitized HTML with instant browser-side output.",
    seoPriority: 0.9,
    inputLabel: "Markdown input",
    outputLabel: "Sanitized HTML",
    inputKind: "markdown"
  },
  {
    id: "html-cleaner",
    title: "HTML Cleaner",
    shortDescription: "Clean unsafe or noisy markup by removing scripts, comments and risky attributes.",
    seoPriority: 0.89,
    inputLabel: "HTML input",
    outputLabel: "Cleaned HTML",
    inputKind: "html"
  },
  {
    id: "html-tag-remover",
    title: "HTML Tag Remover",
    shortDescription: "Remove HTML tags while keeping readable text from the original content.",
    seoPriority: 0.88,
    inputLabel: "HTML input",
    outputLabel: "Text without tags",
    inputKind: "html"
  },
  {
    id: "html-link-extractor",
    title: "HTML Link Extractor",
    shortDescription: "Extract links, anchor text and rel metadata from HTML markup.",
    seoPriority: 0.88,
    inputLabel: "HTML input",
    outputLabel: "Extracted links",
    inputKind: "html"
  },
  {
    id: "html-image-extractor",
    title: "HTML Image Extractor",
    shortDescription: "Extract image sources, alt text and dimensions from HTML.",
    seoPriority: 0.86,
    inputLabel: "HTML input",
    outputLabel: "Extracted images",
    inputKind: "html"
  },
  {
    id: "html-validator",
    title: "HTML Validator",
    shortDescription: "Validate HTML for unsafe markup, duplicate IDs and practical quality issues.",
    seoPriority: 0.92,
    inputLabel: "HTML input",
    outputLabel: "Validation summary",
    inputKind: "html"
  },
  {
    id: "html-pretty-print",
    title: "HTML Pretty Print",
    shortDescription: "Pretty print HTML with stable spacing for reviews, audits and debugging.",
    seoPriority: 0.86,
    inputLabel: "HTML input",
    outputLabel: "Pretty printed HTML",
    inputKind: "html"
  },
  {
    id: "html-entity-encoder",
    title: "HTML Entity Encoder",
    shortDescription: "Encode special characters and symbols as HTML entities.",
    seoPriority: 0.85,
    inputLabel: "Text input",
    outputLabel: "Encoded output",
    inputKind: "text"
  }
];

const sharedPromptContext =
  "Use client-side only logic. Avoid external APIs. Keep HTML handling safe and XSS-aware. Generate SEO-friendly utility content with localized slugs, titles, intro, howItWorks, useCases, examples, FAQ and uiLabels. uiLabels should include keys such as input, output, copy, copied, placeholder, indent, removeComments, preview, sanitizedHtml, plainText, links, images, errors, warnings, valid, invalid, href, text, rel, target, alt, width, height, empty, outputReady, cleanedHtml, formattedHtml, minifiedHtml, markdown, extractedImages, extractedLinks, validationSummary, prettyHtml and encodedText.";

export const htmlToolDefinitions: AddToolDefinition[] = htmlSeeds.map((seed) => {
  const relatedTools = htmlSeeds
    .filter((candidate) => candidate.id !== seed.id)
    .slice(0, 4)
    .map((candidate) => candidate.id);

  return normalizeDefinition({
    id: seed.id,
    title: seed.title,
    shortDescription: seed.shortDescription,
    type: "developer-tool",
    category: "html-tools",
    seoPriority: seed.seoPriority,
    supportedLocales: [...locales],
    relatedTools,
    promptContext: `${sharedPromptContext} Tool goal: ${seed.shortDescription} Input label: ${seed.inputLabel}. Output label: ${seed.outputLabel}.`,
    inputFields: [
      {
        name: seed.inputKind === "markdown" ? "markdown" : seed.inputKind === "text" ? "text" : "html",
        label: seed.inputLabel,
        type: "textarea",
        required: true
      }
    ],
    outputFields: [
      {
        name: "output",
        label: seed.outputLabel,
        type: "text"
      }
    ]
  });
});

function createComponentSource(definition: AddToolDefinition) {
  return `"use client";

import { HtmlToolClient } from "@/components/tools/html-tool-client";

export default function ${definition.componentName}() {
  return <HtmlToolClient toolId="${definition.id}" />;
}
`;
}

function createSchemaSource(definition: AddToolDefinition) {
  const camel = toCamelCase(definition.id);
  const pascal = toPascalCase(definition.id);

  switch (definition.id) {
    case "html-formatter":
    case "html-cleaner":
      return `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  html: z.string().min(1, "Paste HTML to process."),
  indentSize: z.coerce.number().int().min(2).max(6).default(2),
  ${definition.id === "html-cleaner" ? 'removeComments: z.boolean().default(true)' : ""}
});

export const ${camel}OutputSchema = z.object({
  output: z.string(),
  lines: z.number().int().nonnegative(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    case "html-minifier":
      return `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  html: z.string().min(1, "Paste HTML to minify.")
});

export const ${camel}OutputSchema = z.object({
  minifiedHtml: z.string(),
  characters: z.number().int().nonnegative(),
  savedCharacters: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    case "html-viewer":
    case "markdown-to-html":
      return `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  ${definition.id === "markdown-to-html" ? "markdown" : "html"}: z.string().min(1, "Paste source to render.")
});

export const ${camel}OutputSchema = z.object({
  sanitizedHtml: z.string(),
  linkCount: z.number().int().nonnegative(),
  imageCount: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    case "html-link-extractor":
      return `import { z } from "zod";

const linkSchema = z.object({
  href: z.string(),
  text: z.string(),
  rel: z.string(),
  target: z.string()
});

export const ${camel}InputSchema = z.object({
  html: z.string().min(1, "Paste HTML to inspect.")
});

export const ${camel}OutputSchema = z.object({
  links: z.array(linkSchema),
  total: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    case "html-image-extractor":
      return `import { z } from "zod";

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.string(),
  height: z.string()
});

export const ${camel}InputSchema = z.object({
  html: z.string().min(1, "Paste HTML to inspect.")
});

export const ${camel}OutputSchema = z.object({
  images: z.array(imageSchema),
  total: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    case "html-validator":
      return `import { z } from "zod";

const issueSchema = z.object({
  severity: z.enum(["error", "warning"]),
  message: z.string(),
  context: z.string().optional(),
  suggestion: z.string().optional()
});

export const ${camel}InputSchema = z.object({
  html: z.string().min(1, "Paste HTML to validate.")
});

export const ${camel}OutputSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(issueSchema),
  errorCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
    default:
      return `import { z } from "zod";

export const ${camel}InputSchema = z.object({
  ${htmlSeeds.find((seed) => seed.id === definition.id)?.inputKind === "text" ? "text" : htmlSeeds.find((seed) => seed.id === definition.id)?.inputKind === "markdown" ? "markdown" : "html"}: z
    .string()
    .min(1, "Paste source to process.")
});

export const ${camel}OutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`;
  }
}

function createLogicSource(definition: AddToolDefinition) {
  const camel = toCamelCase(definition.id);
  const pascal = toPascalCase(definition.id);

  switch (definition.id) {
    case "html-formatter":
      return `import { formatHtmlDocument } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = formatHtmlDocument(parsed.html, parsed.indentSize);

  return ${camel}OutputSchema.parse({
    output,
    lines: output.split("\\n").length,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-pretty-print":
      return `import { prettyPrintHtmlDocument } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = prettyPrintHtmlDocument(parsed.html);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-minifier":
      return `import { minifyHtmlDocument } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export async function run${pascal}(input: ${pascal}Input): Promise<${pascal}Output> {
  const parsed = ${camel}InputSchema.parse(input);
  const minifiedHtml = await minifyHtmlDocument(parsed.html);

  return ${camel}OutputSchema.parse({
    minifiedHtml,
    characters: minifiedHtml.length,
    savedCharacters: Math.max(parsed.html.length - minifiedHtml.length, 0)
  });
}

export const toolLogic = run${pascal};
`;
    case "html-viewer":
      return `import { extractHtmlImages, extractHtmlLinks, sanitizeHtmlMarkup } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const sanitizedHtml = sanitizeHtmlMarkup(parsed.html, true);

  return ${camel}OutputSchema.parse({
    sanitizedHtml,
    linkCount: extractHtmlLinks(sanitizedHtml).length,
    imageCount: extractHtmlImages(sanitizedHtml).length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-to-text":
      return `import { htmlToText } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = htmlToText(parsed.html);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-escape":
      return `import { escapeHtmlText } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = escapeHtmlText(parsed.text);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-unescape":
      return `import { unescapeHtmlText } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = unescapeHtmlText(parsed.text);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-to-markdown":
      return `import { convertHtmlToMarkdown } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = convertHtmlToMarkdown(parsed.html);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "markdown-to-html":
      return `import { extractHtmlImages, extractHtmlLinks, convertMarkdownToHtml } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const sanitizedHtml = convertMarkdownToHtml(parsed.markdown);

  return ${camel}OutputSchema.parse({
    sanitizedHtml,
    linkCount: extractHtmlLinks(sanitizedHtml).length,
    imageCount: extractHtmlImages(sanitizedHtml).length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-cleaner":
      return `import { cleanHtmlMarkup } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = cleanHtmlMarkup(parsed.html, parsed.indentSize, parsed.removeComments);

  return ${camel}OutputSchema.parse({
    output,
    lines: output.split("\\n").length,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-tag-remover":
      return `import { stripHtmlTags } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = stripHtmlTags(parsed.html);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-link-extractor":
      return `import { extractHtmlLinks } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const links = extractHtmlLinks(parsed.html);

  return ${camel}OutputSchema.parse({
    links,
    total: links.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-image-extractor":
      return `import { extractHtmlImages } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const images = extractHtmlImages(parsed.html);

  return ${camel}OutputSchema.parse({
    images,
    total: images.length
  });
}

export const toolLogic = run${pascal};
`;
    case "html-validator":
      return `import { validateHtmlMarkup } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const result = validateHtmlMarkup(parsed.html);
  return ${camel}OutputSchema.parse(result);
}

export const toolLogic = run${pascal};
`;
    case "html-entity-encoder":
      return `import { encodeHtmlEntities } from "@/lib/html-tools/core";
import { ${camel}InputSchema, ${camel}OutputSchema, type ${pascal}Input, type ${pascal}Output } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: ${pascal}Input): ${pascal}Output {
  const parsed = ${camel}InputSchema.parse(input);
  const output = encodeHtmlEntities(parsed.text);

  return ${camel}OutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = run${pascal};
`;
    default:
      return "";
  }
}

function createTestSource(definition: AddToolDefinition) {
  const pascal = toPascalCase(definition.id);

  switch (definition.id) {
    case "html-formatter":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("formats nested HTML", () => {
    const result = run${pascal}({ html: "<div><span>Hello</span></div>", indentSize: 2 });
    expect(result.output).toContain("\\n");
    expect(result.output).toContain("<span>Hello</span>");
  });
});
`;
    case "html-minifier":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("minifies HTML", async () => {
    const result = await run${pascal}({ html: "<div>  <span>Hello</span> </div>" });
    expect(result.minifiedHtml.length).toBeLessThan("<div>  <span>Hello</span> </div>".length);
  });
});
`;
    case "html-viewer":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("removes unsafe scripts from preview output", () => {
    const result = run${pascal}({ html: "<div><script>alert(1)</script><p>Safe</p></div>" });
    expect(result.sanitizedHtml).not.toContain("<script");
    expect(result.sanitizedHtml).toContain("<p>Safe</p>");
  });
});
`;
    case "html-to-text":
    case "html-tag-remover":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("extracts readable text", () => {
    const result = run${pascal}({ html: "<p>Hello <strong>world</strong></p>" });
    expect(result.output).toContain("Hello");
    expect(result.output).toContain("world");
  });
});
`;
    case "html-escape":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("escapes reserved characters", () => {
    const result = run${pascal}({ text: "<div>Hello & bye</div>" });
    expect(result.output).toContain("&lt;div&gt;");
    expect(result.output).toContain("&amp;");
  });
});
`;
    case "html-unescape":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("decodes entities", () => {
    const result = run${pascal}({ text: "&lt;div&gt;Hello&lt;/div&gt;" });
    expect(result.output).toBe("<div>Hello</div>");
  });
});
`;
    case "html-to-markdown":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("converts basic HTML into markdown", () => {
    const result = run${pascal}({ html: "<h1>Hello</h1><p>World</p>" });
    expect(result.output).toContain("# Hello");
  });
});
`;
    case "markdown-to-html":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("renders markdown as sanitized HTML", () => {
    const result = run${pascal}({ markdown: "# Hello" });
    expect(result.sanitizedHtml).toContain("<h1>Hello</h1>");
  });
});
`;
    case "html-cleaner":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("removes unsafe tags and comments", () => {
    const result = run${pascal}({ html: "<div><!-- note --><script>x()</script><p>Safe</p></div>", indentSize: 2, removeComments: true });
    expect(result.output).not.toContain("<script");
    expect(result.output).not.toContain("<!--");
  });
});
`;
    case "html-link-extractor":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("extracts link metadata", () => {
    const result = run${pascal}({ html: '<a href="https://example.com" rel="nofollow">Docs</a>' });
    expect(result.total).toBe(1);
    expect(result.links[0]?.href).toBe("https://example.com");
  });
});
`;
    case "html-image-extractor":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("extracts image metadata", () => {
    const result = run${pascal}({ html: '<img src="/hero.jpg" alt="Hero" width="640" height="360" />' });
    expect(result.total).toBe(1);
    expect(result.images[0]?.alt).toBe("Hero");
  });
});
`;
    case "html-validator":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("reports unsafe markup", () => {
    const result = run${pascal}({ html: '<a href="javascript:alert(1)" target="_blank">Bad</a><img src="/x.png" />' });
    expect(result.errorCount).toBeGreaterThan(0);
    expect(result.warningCount).toBeGreaterThan(0);
  });
});
`;
    case "html-pretty-print":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("pretty prints markup", () => {
    const result = run${pascal}({ html: "<div><span>Hello</span></div>" });
    expect(result.output).toContain("\\n");
  });
});
`;
    case "html-entity-encoder":
      return `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("encodes special characters", () => {
    const result = run${pascal}({ text: "© <tag>" });
    expect(result.output).toContain("&#169;");
    expect(result.output).toContain("&lt;tag&gt;");
  });
});
`;
    default:
      return "";
  }
}

export function createHtmlToolCode(
  definitionInput: AddToolDefinition | unknown
): ToolCodeArtifacts | null {
  const definition = normalizeDefinition(definitionInput);

  if (!htmlSeeds.some((seed) => seed.id === definition.id)) {
    return null;
  }

  return {
    schemaSource: createSchemaSource(definition),
    logicSource: createLogicSource(definition),
    componentSource: createComponentSource(definition),
    testSource: createTestSource(definition)
  };
}
