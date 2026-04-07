import path from "node:path";
import { z } from "zod";
import { locales, toolCategories } from "@/lib/constants";
import { readJson } from "./shared/filesystem";
import { loadToolDefinitions, syncGeneratedArtifacts } from "./shared/registry-writer";

const toolRecordSchema = z.object({
  id: z.string(),
  type: z.string(),
  category: z.enum(toolCategories),
  componentName: z.string(),
  logicModule: z.string(),
  inputSchema: z.string(),
  outputSchema: z.string(),
  supportedLocales: z.array(z.enum(locales)),
  relatedTools: z.array(z.string()),
  seoPriority: z.number()
});

export async function validateRegistry() {
  const definitions = await loadToolDefinitions();
  const ids = new Set<string>();
  const slugsByLocale = new Map<string, string>();

  for (const definition of definitions) {
    toolRecordSchema.parse(definition);

    if (ids.has(definition.id)) {
      throw new Error(`Duplicate tool id: ${definition.id}`);
    }

    ids.add(definition.id);

    for (const locale of definition.supportedLocales) {
      const contentPath = path.join(
        process.cwd(),
        "src",
        "data",
        "tools",
        "content",
        locale,
        `${definition.id}.json`
      );
      const content = await readJson<{ slug: string }>(contentPath);
      const key = `${locale}:${definition.category}:${content.slug}`;

      if (slugsByLocale.has(key)) {
        throw new Error(`Duplicate slug detected for ${key}`);
      }

      slugsByLocale.set(key, definition.id);
    }
  }

  await syncGeneratedArtifacts();
  return definitions.length;
}

async function main() {
  const count = await validateRegistry();
  console.log(`Registry validated. ${count} tools checked.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
