import { percentageDecreaseCalculatorInputSchema, percentageDecreaseCalculatorOutputSchema, type PercentageDecreaseCalculatorInput, type PercentageDecreaseCalculatorOutput } from "@/tools/schema/percentage-decrease-calculator";

export function runPercentageDecreaseCalculator(input: PercentageDecreaseCalculatorInput): PercentageDecreaseCalculatorOutput {
  const parsed = percentageDecreaseCalculatorInputSchema.parse(input);
  const result = parsed.value * (1 - parsed.percent / 100);
  return percentageDecreaseCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runPercentageDecreaseCalculator;
