import { compoundInterestCalculatorInputSchema, compoundInterestCalculatorOutputSchema, type CompoundInterestCalculatorInput, type CompoundInterestCalculatorOutput } from "@/tools/schema/compound-interest-calculator";

export function runCompoundInterestCalculator(input: CompoundInterestCalculatorInput): CompoundInterestCalculatorOutput {
  const parsed = compoundInterestCalculatorInputSchema.parse(input);
  const result =
    parsed.principal === 0
      ? 0
      : parsed.years === 0 || parsed.annualRate === 0
        ? parsed.principal
        : parsed.compoundsPerYear <= 0
          ? 0
          : parsed.principal *
            Math.pow(
              1 + parsed.annualRate / 100 / parsed.compoundsPerYear,
              parsed.compoundsPerYear * parsed.years
            );

  return compoundInterestCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runCompoundInterestCalculator;
