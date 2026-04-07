import { milesToKmConverterInputSchema, milesToKmConverterOutputSchema, type MilesToKmConverterInput, type MilesToKmConverterOutput } from "@/tools/schema/miles-to-km-converter";

export function runMilesToKmConverter(input: MilesToKmConverterInput): MilesToKmConverterOutput {
  const parsed = milesToKmConverterInputSchema.parse(input);
  const result = parsed.value * 1.609344;
  return milesToKmConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runMilesToKmConverter;
