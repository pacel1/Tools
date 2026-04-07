import { z } from "zod";

export const tipCalculatorInputSchema = z.object({
  amount: z.coerce.number().finite().min(0),
  percent: z.coerce.number().finite().min(0)
});
export const tipCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = tipCalculatorInputSchema;
export const toolOutputSchema = tipCalculatorOutputSchema;
export type TipCalculatorInput = z.infer<typeof tipCalculatorInputSchema>;
export type TipCalculatorOutput = z.infer<typeof tipCalculatorOutputSchema>;
