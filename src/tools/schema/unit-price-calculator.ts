import { z } from "zod";

export const unitPriceCalculatorInputSchema = z.object({
  totalPrice: z.coerce.number().finite().min(0),
  quantity: z.coerce.number().finite().min(0)
});
export const unitPriceCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = unitPriceCalculatorInputSchema;
export const toolOutputSchema = unitPriceCalculatorOutputSchema;
export type UnitPriceCalculatorInput = z.infer<typeof unitPriceCalculatorInputSchema>;
export type UnitPriceCalculatorOutput = z.infer<typeof unitPriceCalculatorOutputSchema>;
