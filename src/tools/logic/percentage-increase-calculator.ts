import { percentageIncreaseCalculatorInputSchema, percentageIncreaseCalculatorOutputSchema, type PercentageIncreaseCalculatorInput, type PercentageIncreaseCalculatorOutput } from "@/tools/schema/percentage-increase-calculator";

export function runPercentageIncreaseCalculator(input: PercentageIncreaseCalculatorInput): PercentageIncreaseCalculatorOutput {
  const parsed = percentageIncreaseCalculatorInputSchema.parse(input);
  const result = parsed.value * (1 + parsed.percent / 100);
  return percentageIncreaseCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runPercentageIncreaseCalculator;
