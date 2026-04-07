import path from "node:path";
import { generateToolCode } from "./generate-tool-code";
import { generateToolContent } from "./generate-tool-content";
import {
  createToolRecord,
  getToolPaths,
  type AddToolDefinition
} from "./shared/definitions";
import { writeJson } from "./shared/filesystem";
import { htmlToolDefinitions } from "./shared/html-tools";
import { syncGeneratedArtifacts } from "./shared/registry-writer";

async function writeHtmlTool(definition: AddToolDefinition) {
  const record = createToolRecord(definition);
  const paths = getToolPaths(definition);

  await writeJson(path.join(process.cwd(), paths.definitionJson), record);
  await generateToolCode(definition);
  await generateToolContent(definition);
}

async function main() {
  for (const definition of htmlToolDefinitions) {
    console.log(`Generating ${definition.id}...`);
    await writeHtmlTool(definition);
  }

  await syncGeneratedArtifacts();
  console.log(`Seeded ${htmlToolDefinitions.length} HTML tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
