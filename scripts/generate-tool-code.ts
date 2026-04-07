import path from "node:path";
import {
  getToolPaths,
  normalizeDefinition,
  toCamelCase,
  toPascalCase,
  type AddToolDefinition,
  type ToolCodeArtifacts
} from "./shared/definitions";
import { parseArgs, loadDefinitionFromFile } from "./shared/cli";
import { writeFileSafe } from "./shared/filesystem";
import { createHtmlToolCode } from "./shared/html-tools";
import { createGrowthToolCode } from "./shared/growth-tools";
import { canUseOpenAI, generateStructuredObject } from "./shared/openai";
import { createFallbackToolCode } from "./shared/templates";

const codeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    schemaSource: { type: "string" },
    logicSource: { type: "string" },
    componentSource: { type: "string" },
    testSource: { type: "string" }
  },
  required: ["schemaSource", "logicSource", "componentSource", "testSource"]
};

function cleanSource(source: string) {
  return source.replace(/^```[a-z]*\n?/i, "").replace(/\n```$/, "").trim() + "\n";
}

async function createArtifacts(definition: AddToolDefinition): Promise<ToolCodeArtifacts> {
  const htmlArtifacts = createHtmlToolCode(definition);
  const growthArtifacts = createGrowthToolCode(definition);

  if (htmlArtifacts) {
    return htmlArtifacts;
  }

  if (growthArtifacts) {
    return growthArtifacts;
  }

  if (!canUseOpenAI()) {
    return createFallbackToolCode(definition);
  }

  const pascal = toPascalCase(definition.id);
  const camel = toCamelCase(definition.id);

  return generateStructuredObject<ToolCodeArtifacts>({
    name: "tool_code_bundle",
    schema: codeSchema,
    system:
      "You generate production-ready TypeScript source files for a Next.js 15 tools portal. Return raw source strings only, no markdown fences. Use ASCII only. The component must be a client component with Tailwind classes. The schema file must export named schemas plus toolInputSchema and toolOutputSchema aliases. The logic file must export a run function and toolLogic alias. The test file must use Vitest.",
    prompt: JSON.stringify(
      {
        definition,
        conventions: {
          componentPath: `src/components/tools/${definition.id}-tool.tsx`,
          logicPath: `src/tools/logic/${definition.id}.ts`,
          schemaPath: `src/tools/schema/${definition.id}.ts`,
          testPath: `src/tools/tests/${definition.id}.test.ts`,
          componentName: definition.componentName,
          runFunctionName: `run${pascal}`,
          inputSchemaName: `${camel}InputSchema`,
          outputSchemaName: `${camel}OutputSchema`
        }
      },
      null,
      2
    )
  });
}

export async function generateToolCode(definitionInput: AddToolDefinition | unknown) {
  const definition = normalizeDefinition(definitionInput);
  const artifacts = await createArtifacts(definition);
  const paths = getToolPaths(definition);

  await writeFileSafe(path.join(process.cwd(), paths.schemaFile), cleanSource(artifacts.schemaSource));
  await writeFileSafe(path.join(process.cwd(), paths.logicFile), cleanSource(artifacts.logicSource));
  await writeFileSafe(
    path.join(process.cwd(), paths.componentFile),
    cleanSource(artifacts.componentSource)
  );
  await writeFileSafe(path.join(process.cwd(), paths.testFile), cleanSource(artifacts.testSource));

  return artifacts;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = args.get("file");

  if (!file) {
    throw new Error("Pass --file path/to/tool-definition.json");
  }

  const definition = await loadDefinitionFromFile(file);
  await generateToolCode(definition);
  console.log(`Generated tool code for ${definition.id}.`);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
