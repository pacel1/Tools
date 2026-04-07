import { lbsToKgConverterInputSchema, lbsToKgConverterOutputSchema, type LbsToKgConverterInput, type LbsToKgConverterOutput } from "@/tools/schema/lbs-to-kg-converter";

export function runLbsToKgConverter(input: LbsToKgConverterInput): LbsToKgConverterOutput {
  const parsed = lbsToKgConverterInputSchema.parse(input);
  const result = parsed.value * 0.45359237;
  return lbsToKgConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runLbsToKgConverter;
