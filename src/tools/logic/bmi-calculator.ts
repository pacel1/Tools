import { bmiCalculatorInputSchema, bmiCalculatorOutputSchema, type BmiCalculatorInput, type BmiCalculatorOutput } from "@/tools/schema/bmi-calculator";

export function runBmiCalculator(input: BmiCalculatorInput): BmiCalculatorOutput {
  const parsed = bmiCalculatorInputSchema.parse(input);
  const result =
    parsed.heightCm <= 0 ? 0 : parsed.weightKg / Math.pow(parsed.heightCm / 100, 2);

  return bmiCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runBmiCalculator;
