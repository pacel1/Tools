import { discountCalculatorInputSchema, discountCalculatorOutputSchema, type DiscountCalculatorInput, type DiscountCalculatorOutput } from "@/tools/schema/discount-calculator";

export function runDiscountCalculator(input: DiscountCalculatorInput): DiscountCalculatorOutput {
  const parsed = discountCalculatorInputSchema.parse(input);
  const result = parsed.amount * (1 - parsed.percent / 100);
  return discountCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runDiscountCalculator;
