import { gbToMbConverterInputSchema, gbToMbConverterOutputSchema, type GbToMbConverterInput, type GbToMbConverterOutput } from "@/tools/schema/gb-to-mb-converter";

export function runGbToMbConverter(input: GbToMbConverterInput): GbToMbConverterOutput {
  const parsed = gbToMbConverterInputSchema.parse(input);
  const result = parsed.value * 1024;
  return gbToMbConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runGbToMbConverter;
