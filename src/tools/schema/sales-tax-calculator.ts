import { z } from "zod";

export const salesTaxCalculatorInputSchema = z.object({
  amount: z.coerce.number().finite().min(0),
  percent: z.coerce.number().finite().min(0)
});
export const salesTaxCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = salesTaxCalculatorInputSchema;
export const toolOutputSchema = salesTaxCalculatorOutputSchema;
export type SalesTaxCalculatorInput = z.infer<typeof salesTaxCalculatorInputSchema>;
export type SalesTaxCalculatorOutput = z.infer<typeof salesTaxCalculatorOutputSchema>;
