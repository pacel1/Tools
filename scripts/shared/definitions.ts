import path from "node:path";
import { z } from "zod";
import { locales, toolCategories } from "@/lib/constants";

const inputFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["number", "text", "textarea", "json"]).default("text"),
  placeholder: z.string().default(""),
  required: z.boolean().default(true)
});

const outputFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["number", "text", "json"]).default("text")
});

export const addToolDefinitionSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use kebab-case for the tool id."),
  title: z.string().min(2),
  shortDescription: z.string().min(10),
  type: z.enum([
    "converter",
    "calculator",
    "generator",
    "text-tool",
    "developer-tool",
    "date-time-tool",
    "image-tool",
    "security-tool"
  ]),
  category: z.enum(toolCategories),
  seoPriority: z.number().min(0).max(1).default(0.8),
  supportedLocales: z.array(z.enum(locales)).default([...locales]),
  relatedTools: z.array(z.string()).default([]),
  promptContext: z.string().default(""),
  inputFields: z.array(inputFieldSchema).default([]),
  outputFields: z.array(outputFieldSchema).default([]),
  componentName: z.string().optional()
});

export type AddToolDefinition = z.infer<typeof addToolDefinitionSchema>;

export type ToolCodeArtifacts = {
  schemaSource: string;
  logicSource: string;
  componentSource: string;
  testSource: string;
};

export type GeneratedLocaleContent = {
  toolId: string;
  locale: (typeof locales)[number];
  slug: string;
  h1: string;
  title: string;
  shortDescription: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  overview: string;
  howItWorks: string[];
  useCases?: string[];
  examples: Array<{
    title: string;
    input: string;
    output: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  uiLabels?: Record<string, string>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export type ToolContentArtifacts = Record<(typeof locales)[number], GeneratedLocaleContent>;

export function toPascalCase(value: string) {
  return value
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

export function toCamelCase(value: string) {
  const pascal = toPascalCase(value);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function normalizeDefinition(input: unknown): AddToolDefinition {
  const parsed = addToolDefinitionSchema.parse(input);
  return {
    ...parsed,
    componentName: parsed.componentName ?? `${toPascalCase(parsed.id)}Tool`
  };
}

export function createToolRecord(definition: AddToolDefinition) {
  const camel = toCamelCase(definition.id);

  return {
    id: definition.id,
    type: definition.type,
    category: definition.category,
    componentName: definition.componentName ?? `${toPascalCase(definition.id)}Tool`,
    logicModule: definition.id,
    inputSchema: `${camel}InputSchema`,
    outputSchema: `${camel}OutputSchema`,
    supportedLocales: definition.supportedLocales,
    relatedTools: definition.relatedTools,
    seoPriority: definition.seoPriority
  };
}

export function getToolPaths(definition: AddToolDefinition) {
  return {
    definitionJson: path.join("src", "data", "tools", "definitions", `${definition.id}.json`),
    componentFile: path.join("src", "components", "tools", `${definition.id}-tool.tsx`),
    logicFile: path.join("src", "tools", "logic", `${definition.id}.ts`),
    schemaFile: path.join("src", "tools", "schema", `${definition.id}.ts`),
    testFile: path.join("src", "tools", "tests", `${definition.id}.test.ts`)
  };
}
