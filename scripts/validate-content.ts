import { validateContentFiles, formatContentQualityIssues, pilotToolIds } from "./shared/content-quality";
import { loadToolDefinitions } from "./shared/registry-writer";

function parseToolIds(args: string[]) {
  const toolsArg = args.find((arg) => arg.startsWith("--tools="));
  if (toolsArg) {
    return toolsArg
      .slice("--tools=".length)
      .split(/[,\s]+/)
      .map((toolId) => toolId.trim())
      .filter(Boolean);
  }

  return undefined;
}

async function main() {
  const args = process.argv.slice(2);
  let toolIds = parseToolIds(args);

  if (args.includes("--all")) {
    toolIds = (await loadToolDefinitions()).map((definition) => definition.id);
  }

  const effectiveToolIds = toolIds ?? [...pilotToolIds];
  const issues = await validateContentFiles({ toolIds: effectiveToolIds });

  if (issues.length > 0) {
    console.error(
      `Content quality validation failed for ${effectiveToolIds.length} tool(s):\n${formatContentQualityIssues(
        issues
      )}`
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Content quality validated for ${effectiveToolIds.length} tool(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
