import { simpleInterestCalculatorInputSchema, simpleInterestCalculatorOutputSchema, type SimpleInterestCalculatorInput, type SimpleInterestCalculatorOutput } from "@/tools/schema/simple-interest-calculator";

export function runSimpleInterestCalculator(input: SimpleInterestCalculatorInput): SimpleInterestCalculatorOutput {
  const parsed = simpleInterestCalculatorInputSchema.parse(input);
  const result = parsed.principal * (parsed.annualRate / 100) * parsed.years;
  return simpleInterestCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runSimpleInterestCalculator;
