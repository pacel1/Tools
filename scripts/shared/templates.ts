import { locales } from "@/lib/constants";
import {
  toCamelCase,
  toPascalCase,
  type AddToolDefinition,
  type ToolCodeArtifacts,
  type ToolContentArtifacts
} from "./definitions";

function getInputFields(definition: AddToolDefinition) {
  return definition.inputFields.length > 0
    ? definition.inputFields
    : [
        {
          name: "source",
          label: "Source",
          type: "textarea" as const,
          placeholder: "",
          required: true
        }
      ];
}

function getOutputFields(definition: AddToolDefinition) {
  return definition.outputFields.length > 0
    ? definition.outputFields
    : [{ name: "summary", label: "Summary", type: "text" as const }];
}

export function createFallbackToolCode(
  definition: AddToolDefinition
): ToolCodeArtifacts {
  const pascal = toPascalCase(definition.id);
  const camel = toCamelCase(definition.id);
  const inputFields = getInputFields(definition);
  const outputFields = getOutputFields(definition);

  const schemaShape = inputFields
    .map((field) => {
      const base =
        field.type === "number"
          ? 'z.coerce.number({ invalid_type_error: "Expected a number." })'
          : 'z.string()';
      return `  ${field.name}: ${field.required ? base : `${base}.optional()`}`;
    })
    .join(",\n");

  const outputShape = outputFields
    .map((field) => {
      const base = field.type === "number" ? "z.number()" : "z.string()";
      return `  ${field.name}: ${base}`;
    })
    .join(",\n");

  const summaryExpression = outputFields
    .map((field) => `${field.name}: ${field.type === "number" ? "0" : `\`${field.label} generated\``}`)
    .join(",\n    ");

  const componentInitialState = inputFields
    .map((field) => `  ${field.name}: ${field.type === "number" ? '"0"' : '""'}`)
    .join(",\n");

  const componentFieldBlocks = inputFields
    .map((field) => {
      const element =
        field.type === "textarea"
          ? `<textarea\n          id="${field.name}"\n          className="min-h-36 w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"\n          value={form.${field.name}}\n          onChange={(event) => update("${field.name}", event.target.value)}\n        />`
          : `<input\n          id="${field.name}"\n          className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 outline-none transition focus:border-cyan-300/50"\n          type="${field.type === "number" ? "number" : "text"}"\n          value={form.${field.name}}\n          onChange={(event) => update("${field.name}", event.target.value)}\n        />`;

      return `      <div>\n        <label className="mb-2 block text-sm text-white/70" htmlFor="${field.name}">\n          ${field.label}\n        </label>\n        ${element}\n      </div>`;
    })
    .join("\n\n");

  const normalizedInput = inputFields
    .map(
      (field) =>
        `      ${field.name}: ${field.type === "number" ? `Number(form.${field.name} || 0)` : `form.${field.name}`}`
    )
    .join(",\n");

  return {
    schemaSource: `import { z } from "zod";

export const ${camel}InputSchema = z.object({
${schemaShape}
});

export const ${camel}OutputSchema = z.object({
${outputShape}
});

export const toolInputSchema = ${camel}InputSchema;
export const toolOutputSchema = ${camel}OutputSchema;

export type ${pascal}Input = z.infer<typeof ${camel}InputSchema>;
export type ${pascal}Output = z.infer<typeof ${camel}OutputSchema>;
`,
    logicSource: `import { ${camel}InputSchema, ${camel}OutputSchema } from "@/tools/schema/${definition.id}";

export function run${pascal}(input: unknown) {
  const parsed = ${camel}InputSchema.parse(input);

  return ${camel}OutputSchema.parse({
    ${summaryExpression}
  });
}

export const toolLogic = run${pascal};
`,
    componentSource: `"use client";

import { useState } from "react";
import { run${pascal} } from "@/tools/logic/${definition.id}";

export function ${definition.componentName}() {
  const [form, setForm] = useState({
${componentInitialState}
  });

  const result = run${pascal}({
${normalizedInput}
  });

  function update(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <div className="space-y-5">
${componentFieldBlocks}

      <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-300/10 p-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-100/80">Result</p>
        <pre className="mt-3 overflow-x-auto text-sm text-white/90">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ${definition.componentName};
`,
    testSource: `import { describe, expect, it } from "vitest";
import { run${pascal} } from "@/tools/logic/${definition.id}";

describe("${definition.id}", () => {
  it("returns structured output", () => {
    const result = run${pascal}({
${inputFields
  .map(
    (field) =>
      `      ${field.name}: ${field.type === "number" ? 1 : JSON.stringify(field.placeholder || field.label)}`
  )
  .join(",\n")}
    });

    expect(result).toBeDefined();
  });
});
`
  };
}

const localePrefixes: Record<(typeof locales)[number], string> = {
  en: "How to use",
  pl: "Jak używać",
  es: "Cómo usar",
  de: "So funktioniert",
  fr: "Comment l'utiliser"
};

export function createFallbackToolContent(
  definition: AddToolDefinition
): ToolContentArtifacts {
  return Object.fromEntries(
    definition.supportedLocales.map((locale) => [
      locale,
      {
        toolId: definition.id,
        locale,
        slug: definition.id,
        h1: locale === "en" ? definition.title : `${definition.title}`,
        title: definition.title,
        shortDescription: definition.shortDescription,
        metaTitle: definition.title,
        metaDescription: definition.shortDescription,
        intro: `${definition.title} gives users a focused place to enter the relevant values, review the result and continue their workflow without leaving the page.`,
        overview: `${definition.title} starts with a generated baseline so the tool can be reviewed in the browser before final editorial work begins. Replace this paragraph with domain-specific guidance, realistic examples and local terminology before publishing the page as finished content. The final version should explain when to use the tool, what the result means and which limits users should keep in mind.`,
        howItWorks: [
          `${localePrefixes[locale]} ${definition.title}.`,
          "Generated code validates inputs with Zod before running the core logic.",
          "The page includes examples, FAQ, metadata and related internal links."
        ],
        useCases: [
          {
            title: "Initial review",
            description:
              "Use the generated page to verify that inputs, output labels and page structure match the intended tool workflow."
          },
          {
            title: "Editorial rewrite",
            description:
              "Replace scaffolded copy with specific use cases, examples and answers before the page is treated as production content."
          },
          {
            title: "Quality validation",
            description:
              "Run content validation after editing to catch generic phrases, thin sections and repeated example data."
          }
        ],
        examples: [
          {
            title: "Example input",
            input: "Sample input",
            output: "Sample output",
            description: "Replace this generated example with domain-specific examples."
          },
          {
            title: "Second sample scenario",
            input: "Another sample input",
            output: "Another sample output",
            description: "Use a different input to show how the tool behaves in another realistic scenario."
          },
          {
            title: "Edge sample scenario",
            input: "Boundary sample input",
            output: "Boundary sample output",
            description: "Document a practical limit or interpretation detail users should understand."
          }
        ],
        faq: [
          {
            question: `What does ${definition.title} do?`,
            answer: definition.shortDescription
          },
          {
            question: "Where should I customize this tool?",
            answer:
              "Update the generated schema, logic, component and locale JSON files after scaffolding."
          },
          {
            question: "Should this generated copy be published as-is?",
            answer:
              "No. Treat the fallback text as a scaffold and replace it with specific, reviewed content for each locale."
          },
          {
            question: "How should examples be prepared?",
            answer:
              "Use varied realistic inputs, exact outputs and short explanations that match the intent of the tool."
          }
        ],
        seo: {
          title: definition.title,
          description: definition.shortDescription,
          keywords: [definition.id, definition.category, definition.type]
        }
      }
    ])
  ) as ToolContentArtifacts;
}
