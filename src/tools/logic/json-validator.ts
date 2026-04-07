import { jsonValidatorInputSchema, jsonValidatorOutputSchema, type JsonValidatorInput, type JsonValidatorOutput } from "@/tools/schema/json-validator";

export function runJsonValidator(input: JsonValidatorInput): JsonValidatorOutput {
  const parsed = jsonValidatorInputSchema.parse(input);
  try {
    const data = JSON.parse(parsed.source);
    return jsonValidatorOutputSchema.parse({
      valid: true,
      result: JSON.stringify(data, null, 2),
      message: "Valid JSON"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return jsonValidatorOutputSchema.parse({ valid: false, result: "", message });
  }
}

export const toolLogic = runJsonValidator;
