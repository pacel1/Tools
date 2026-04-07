import { inchesToMmConverterInputSchema, inchesToMmConverterOutputSchema, type InchesToMmConverterInput, type InchesToMmConverterOutput } from "@/tools/schema/inches-to-mm-converter";

export function runInchesToMmConverter(input: InchesToMmConverterInput): InchesToMmConverterOutput {
  const parsed = inchesToMmConverterInputSchema.parse(input);
  const result = parsed.value * 25.4;
  return inchesToMmConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runInchesToMmConverter;
