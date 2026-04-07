import { tipCalculatorInputSchema, tipCalculatorOutputSchema, type TipCalculatorInput, type TipCalculatorOutput } from "@/tools/schema/tip-calculator";

export function runTipCalculator(input: TipCalculatorInput): TipCalculatorOutput {
  const parsed = tipCalculatorInputSchema.parse(input);
  const result = parsed.amount * (1 + parsed.percent / 100);
  return tipCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runTipCalculator;
