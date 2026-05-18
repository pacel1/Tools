import path from "node:path";
import { locales, toolCategories } from "@/lib/constants";
import type { ToolDefinition } from "@/lib/tools/types";
import { listJsonFiles, readJson, writeFileSafe, writeJson } from "./filesystem";
import { toCamelCase, toPascalCase } from "./definitions";

const definitionsDir = path.join(process.cwd(), "src", "data", "tools", "definitions");
const contentRoot = path.join(process.cwd(), "src", "data", "tools", "content");

export async function loadToolDefinitions() {
  const files = await listJsonFiles(definitionsDir);
  const definitions = await Promise.all(files.map((file) => readJson<ToolDefinition>(file)));

  return definitions.sort((left, right) => right.seoPriority - left.seoPriority);
}

function enrichRelatedTools(definitions: ToolDefinition[]) {
  return definitions.map((definition) => {
    const preferred = definition.relatedTools.filter((id) =>
      definitions.some((candidate) => candidate.id === id && candidate.id !== definition.id)
    );
    const byCategory = definitions
      .filter(
        (candidate) =>
          candidate.id !== definition.id && candidate.category === definition.category
      )
      .map((candidate) => candidate.id);
    const combined = [...new Set([...preferred, ...byCategory])].slice(0, 4);
    return {
      ...definition,
      relatedTools: combined
    };
  });
}

async function persistDefinitions(definitions: ToolDefinition[]) {
  await Promise.all(
    definitions.map((definition) =>
      writeJson(path.join(definitionsDir, `${definition.id}.json`), definition)
    )
  );
}

async function writeCategoryIndex(definitions: ToolDefinition[]) {
  const data = Object.fromEntries(
    toolCategories.map((category) => [
      category,
      definitions
        .filter((definition) => definition.category === category)
        .map((definition) => definition.id)
    ])
  );

  await writeJson(path.join(process.cwd(), "src", "data", "categories", "generated.json"), data);
}

async function writeRegistryFile(definitions: ToolDefinition[]) {
  const imports = definitions
    .map(
      (definition) =>
        `import ${toCamelCase(definition.id)} from "@/data/tools/definitions/${definition.id}.json";`
    )
    .join("\n");
  const list = definitions.map((definition) => `  ${toCamelCase(definition.id)}`).join(",\n");

  await writeFileSafe(
    path.join(process.cwd(), "src", "lib", "tools", "tool-registry.generated.ts"),
    `${imports}
import type { ToolDefinition } from "@/lib/tools/types";

export const toolDefinitions = [
${list}
] as ToolDefinition[];
`
  );
}

async function writeRuntimeFile(definitions: ToolDefinition[]) {
  const logicImports = definitions
    .map(
      (definition) =>
        `import { toolLogic as ${toCamelCase(definition.id)}Logic } from "@/tools/logic/${definition.logicModule}";`
    )
    .join("\n");

  const schemaImports = definitions
    .map(
      (definition) =>
        `import { toolInputSchema as ${toCamelCase(definition.id)}InputSchema, toolOutputSchema as ${toCamelCase(definition.id)}OutputSchema } from "@/tools/schema/${definition.id}";`
    )
    .join("\n");

  const logicMap = definitions
    .map((definition) => `  "${definition.logicModule}": ${toCamelCase(definition.id)}Logic`)
    .join(",\n");
  const inputMap = definitions
    .map(
      (definition) =>
        `  "${definition.inputSchema}": ${toCamelCase(definition.id)}InputSchema`
    )
    .join(",\n");
  const outputMap = definitions
    .map(
      (definition) =>
        `  "${definition.outputSchema}": ${toCamelCase(definition.id)}OutputSchema`
    )
    .join(",\n");

  await writeFileSafe(
    path.join(process.cwd(), "src", "lib", "tools", "tool-runtime.generated.ts"),
    `${logicImports}
${schemaImports}

export const toolLogicModules = {
${logicMap}
} as const;

export const inputSchemas = {
${inputMap}
} as const;

export const outputSchemas = {
${outputMap}
} as const;
`
  );
}

async function writeComponentRuntimeFile(definitions: ToolDefinition[]) {
  const components = definitions
    .map(
      (definition) =>
        `  ${definition.componentName}: dynamic(() => import("@/components/tools/${definition.id}-tool"), {
    loading: ToolLoading,
    ssr: false
  })`
    )
    .join(",\n");

  await writeFileSafe(
    path.join(process.cwd(), "src", "lib", "tools", "tool-components.generated.ts"),
    `"use client";

import dynamic from "next/dynamic";
import { createElement } from "react";

function ToolLoading() {
  return createElement("div", {
    className:
      "min-h-[260px] rounded-[24px] border border-white/10 bg-slate-950/45"
  });
}

const toolComponents = {
${components}
} as const;

export type ToolComponentName = keyof typeof toolComponents;

export function DynamicToolComponent({
  componentName
}: {
  componentName: ToolComponentName;
}) {
  const ToolComponent = toolComponents[componentName];
  return createElement(ToolComponent);
}
`
  );
}

async function writeContentManifest() {
  const localeEntries = await Promise.all(
    locales.map(async (locale) => {
      const files = await listJsonFiles(path.join(contentRoot, locale));
      return [locale, files] as const;
    })
  );

  const imports: string[] = [];
  const localeMaps: string[] = [];

  for (const [locale, files] of localeEntries) {
    const entries = files.map((filePath) => {
      const toolId = path.basename(filePath, ".json");
      const importName = `${locale}${toPascalCase(toolId)}`;
      imports.push(`import ${importName} from "@/data/tools/content/${locale}/${toolId}.json";`);
      return `    "${toolId}": ${importName}`;
    });

    localeMaps.push(`  ${locale}: {\n${entries.join(",\n")}\n  }`);
  }

  await writeFileSafe(
    path.join(process.cwd(), "src", "lib", "tools", "tool-content.generated.ts"),
    `${imports.join("\n")}
import type { Locale } from "@/lib/constants";
import type { ToolLocaleContent } from "@/lib/tools/types";

type ToolContentMap = Record<Locale, Record<string, ToolLocaleContent>>;

export const toolContent = {
${localeMaps.join(",\n")}
} as unknown as ToolContentMap;
`
  );
}

export async function syncGeneratedArtifacts() {
  const loaded = await loadToolDefinitions();
  const definitions = enrichRelatedTools(loaded);
  await persistDefinitions(definitions);
  await writeCategoryIndex(definitions);
  await writeRegistryFile(definitions);
  await writeRuntimeFile(definitions);
  await writeComponentRuntimeFile(definitions);
  await writeContentManifest();
  return definitions;
}
