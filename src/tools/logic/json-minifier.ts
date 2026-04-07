import { jsonMinifierInputSchema, jsonMinifierOutputSchema, type JsonMinifierInput, type JsonMinifierOutput } from "@/tools/schema/json-minifier";

export function runJsonMinifier(input: JsonMinifierInput): JsonMinifierOutput {
  const parsed = jsonMinifierInputSchema.parse(input);
  try {
    const data = JSON.parse(parsed.source);
    return jsonMinifierOutputSchema.parse({
      valid: true,
      result: JSON.stringify(data),
      message: "JSON minified successfully"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return jsonMinifierOutputSchema.parse({ valid: false, result: "", message });
  }
}

export const toolLogic = runJsonMinifier;
