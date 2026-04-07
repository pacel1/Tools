import {
  jsonFormatterInputSchema,
  jsonFormatterOutputSchema
} from "@/tools/schema/json-formatter";

export function formatJson(input: unknown) {
  const parsed = jsonFormatterInputSchema.parse(input);
  const jsonValue = JSON.parse(parsed.json);
  const formatted = JSON.stringify(jsonValue, null, parsed.indent);
  const minified = JSON.stringify(jsonValue);

  return jsonFormatterOutputSchema.parse({
    formatted,
    minified,
    lineCount: formatted.split("\n").length
  });
}

export const toolLogic = formatJson;
