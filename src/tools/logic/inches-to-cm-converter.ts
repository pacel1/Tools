import { inchesToCmConverterInputSchema, inchesToCmConverterOutputSchema, type InchesToCmConverterInput, type InchesToCmConverterOutput } from "@/tools/schema/inches-to-cm-converter";

export function runInchesToCmConverter(input: InchesToCmConverterInput): InchesToCmConverterOutput {
  const parsed = inchesToCmConverterInputSchema.parse(input);
  const result = parsed.value * 2.54;
  return inchesToCmConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runInchesToCmConverter;
