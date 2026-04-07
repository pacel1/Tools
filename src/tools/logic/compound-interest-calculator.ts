import { compoundInterestCalculatorInputSchema, compoundInterestCalculatorOutputSchema, type CompoundInterestCalculatorInput, type CompoundInterestCalculatorOutput } from "@/tools/schema/compound-interest-calculator";

export function runCompoundInterestCalculator(input: CompoundInterestCalculatorInput): CompoundInterestCalculatorOutput {
  const parsed = compoundInterestCalculatorInputSchema.parse(input);
  const result = parsed.principal * Math.pow(1 + parsed.annualRate / 100 / parsed.compoundsPerYear, parsed.compoundsPerYear * parsed.years);
  return compoundInterestCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runCompoundInterestCalculator;
