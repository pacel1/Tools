import { z } from "zod";

export const discountCalculatorInputSchema = z.object({
  amount: z.coerce.number().finite().min(0),
  percent: z.coerce.number().finite().min(0)
});
export const discountCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = discountCalculatorInputSchema;
export const toolOutputSchema = discountCalculatorOutputSchema;
export type DiscountCalculatorInput = z.infer<typeof discountCalculatorInputSchema>;
export type DiscountCalculatorOutput = z.infer<typeof discountCalculatorOutputSchema>;
