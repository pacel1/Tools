import path from "node:path";
import { generateToolCode } from "./generate-tool-code";
import { generateToolContent } from "./generate-tool-content";
import {
  createToolRecord,
  getToolPaths,
  type AddToolDefinition
} from "./shared/definitions";
import { parseArgs } from "./shared/cli";
import { writeJson } from "./shared/filesystem";
import { growthToolDefinitions } from "./shared/growth-tools";
import { syncGeneratedArtifacts } from "./shared/registry-writer";

async function writeGrowthTool(definition: AddToolDefinition) {
  const record = createToolRecord(definition);
  const paths = getToolPaths(definition);

  await writeJson(path.join(process.cwd(), paths.definitionJson), record);
  await generateToolCode(definition);
  await generateToolContent(definition);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const onlyId = args.get("id");
  const definitions = onlyId
    ? growthToolDefinitions.filter((definition) => definition.id === onlyId)
    : growthToolDefinitions;

  if (definitions.length === 0) {
    throw new Error(onlyId ? `No growth tool found for id "${onlyId}".` : "No growth tools found.");
  }

  for (const definition of definitions) {
    console.log(`Generating ${definition.id}...`);
    await writeGrowthTool(definition);
  }

  await syncGeneratedArtifacts();
  console.log(`Seeded ${definitions.length} growth tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
