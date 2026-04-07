import { feetToMetersConverterInputSchema, feetToMetersConverterOutputSchema, type FeetToMetersConverterInput, type FeetToMetersConverterOutput } from "@/tools/schema/feet-to-meters-converter";

export function runFeetToMetersConverter(input: FeetToMetersConverterInput): FeetToMetersConverterOutput {
  const parsed = feetToMetersConverterInputSchema.parse(input);
  const result = parsed.value * 0.3048;
  return feetToMetersConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runFeetToMetersConverter;
