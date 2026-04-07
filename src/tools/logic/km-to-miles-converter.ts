import { kmToMilesConverterInputSchema, kmToMilesConverterOutputSchema, type KmToMilesConverterInput, type KmToMilesConverterOutput } from "@/tools/schema/km-to-miles-converter";

export function runKmToMilesConverter(input: KmToMilesConverterInput): KmToMilesConverterOutput {
  const parsed = kmToMilesConverterInputSchema.parse(input);
  const result = parsed.value * 0.6213711922;
  return kmToMilesConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runKmToMilesConverter;
