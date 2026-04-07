import { unitPriceCalculatorInputSchema, unitPriceCalculatorOutputSchema, type UnitPriceCalculatorInput, type UnitPriceCalculatorOutput } from "@/tools/schema/unit-price-calculator";

export function runUnitPriceCalculator(input: UnitPriceCalculatorInput): UnitPriceCalculatorOutput {
  const parsed = unitPriceCalculatorInputSchema.parse(input);
  const result = parsed.quantity === 0 ? 0 : parsed.totalPrice / parsed.quantity;
  return unitPriceCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runUnitPriceCalculator;
