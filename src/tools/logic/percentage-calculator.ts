import { percentageCalculatorInputSchema, percentageCalculatorOutputSchema, type PercentageCalculatorInput, type PercentageCalculatorOutput } from "@/tools/schema/percentage-calculator";

export function runPercentageCalculator(input: PercentageCalculatorInput): PercentageCalculatorOutput {
  const parsed = percentageCalculatorInputSchema.parse(input);
  const result = parsed.total === 0 ? 0 : (parsed.value / parsed.total) * 100;
  return percentageCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runPercentageCalculator;
