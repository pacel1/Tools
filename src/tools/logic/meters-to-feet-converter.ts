import { metersToFeetConverterInputSchema, metersToFeetConverterOutputSchema, type MetersToFeetConverterInput, type MetersToFeetConverterOutput } from "@/tools/schema/meters-to-feet-converter";

export function runMetersToFeetConverter(input: MetersToFeetConverterInput): MetersToFeetConverterOutput {
  const parsed = metersToFeetConverterInputSchema.parse(input);
  const result = parsed.value * 3.280839895;
  return metersToFeetConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runMetersToFeetConverter;
