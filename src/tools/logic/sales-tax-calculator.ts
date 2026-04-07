import { salesTaxCalculatorInputSchema, salesTaxCalculatorOutputSchema, type SalesTaxCalculatorInput, type SalesTaxCalculatorOutput } from "@/tools/schema/sales-tax-calculator";

export function runSalesTaxCalculator(input: SalesTaxCalculatorInput): SalesTaxCalculatorOutput {
  const parsed = salesTaxCalculatorInputSchema.parse(input);
  const result = parsed.amount * (1 + parsed.percent / 100);
  return salesTaxCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runSalesTaxCalculator;
