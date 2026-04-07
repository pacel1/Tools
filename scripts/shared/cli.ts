import fs from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { normalizeDefinition, type AddToolDefinition } from "./definitions";
import { locales, toolCategories } from "@/lib/constants";

export function parseArgs(argv: string[]) {
  const args = new Map<string, string>();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith("--")) {
      args.set(key, "true");
      continue;
    }

    args.set(key, next);
    index += 1;
  }

  return args;
}

export async function loadDefinitionFromFile(filePath: string) {
  const absolutePath = path.resolve(filePath);
  const raw = await fs.readFile(absolutePath, "utf8");
  return normalizeDefinition(JSON.parse(raw));
}

export async function promptForDefinition(): Promise<AddToolDefinition> {
  const rl = createInterface({ input, output });

  try {
    const id = await rl.question("Tool id (kebab-case): ");
    const title = await rl.question("Tool title: ");
    const shortDescription = await rl.question("Short description: ");
    const type = await rl.question(
      "Tool type (converter/calculator/generator/text-tool/developer-tool/date-time-tool/image-tool/security-tool): "
    );
    const category = await rl.question(
      `Category (${toolCategories.join(", ")}): `
    );
    const promptContext = await rl.question(
      "Prompt context for code generation (optional): "
    );
    const seoPriority = await rl.question("SEO priority from 0 to 1 (default 0.8): ");

    return normalizeDefinition({
      id,
      title,
      shortDescription,
      type,
      category,
      promptContext,
      seoPriority: seoPriority ? Number(seoPriority) : 0.8,
      supportedLocales: [...locales]
    });
  } finally {
    rl.close();
  }
}
