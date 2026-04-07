import { cmToInchesConverterInputSchema, cmToInchesConverterOutputSchema, type CmToInchesConverterInput, type CmToInchesConverterOutput } from "@/tools/schema/cm-to-inches-converter";

export function runCmToInchesConverter(input: CmToInchesConverterInput): CmToInchesConverterOutput {
  const parsed = cmToInchesConverterInputSchema.parse(input);
  const result = parsed.value * 0.3937007874;
  return cmToInchesConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runCmToInchesConverter;
