import { mmToInchesConverterInputSchema, mmToInchesConverterOutputSchema, type MmToInchesConverterInput, type MmToInchesConverterOutput } from "@/tools/schema/mm-to-inches-converter";

export function runMmToInchesConverter(input: MmToInchesConverterInput): MmToInchesConverterOutput {
  const parsed = mmToInchesConverterInputSchema.parse(input);
  const result = parsed.value * 0.03937007874;
  return mmToInchesConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runMmToInchesConverter;
