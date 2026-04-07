import { mbToGbConverterInputSchema, mbToGbConverterOutputSchema, type MbToGbConverterInput, type MbToGbConverterOutput } from "@/tools/schema/mb-to-gb-converter";

export function runMbToGbConverter(input: MbToGbConverterInput): MbToGbConverterOutput {
  const parsed = mbToGbConverterInputSchema.parse(input);
  const result = parsed.value / 1024;
  return mbToGbConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runMbToGbConverter;
