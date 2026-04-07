import path from "node:path";
import {
  createToolRecord,
  getToolPaths,
  normalizeDefinition
} from "./shared/definitions";
import { loadDefinitionFromFile, parseArgs, promptForDefinition } from "./shared/cli";
import { writeJson } from "./shared/filesystem";
import { generateToolCode } from "./generate-tool-code";
import { generateToolContent } from "./generate-tool-content";
import { loadToolDefinitions, syncGeneratedArtifacts } from "./shared/registry-writer";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const definition = normalizeDefinition(
    args.get("file") ? await loadDefinitionFromFile(args.get("file")!) : await promptForDefinition()
  );

  const existing = await loadToolDefinitions();

  if (existing.some((tool) => tool.id === definition.id)) {
    throw new Error(`Tool ${definition.id} already exists.`);
  }

  const record = createToolRecord(definition);
  const paths = getToolPaths(definition);

  await writeJson(path.join(process.cwd(), paths.definitionJson), record);
  await generateToolCode(definition);
  await generateToolContent(definition);
  await syncGeneratedArtifacts();

  console.log(`Added tool ${definition.id}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
