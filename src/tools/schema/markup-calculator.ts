import { z } from "zod";

export const markupCalculatorInputSchema = z.object({
  cost: z.coerce.number().finite().min(0),
  markupPercent: z.coerce.number().finite().min(0)
});
export const markupCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = markupCalculatorInputSchema;
export const toolOutputSchema = markupCalculatorOutputSchema;
export type MarkupCalculatorInput = z.infer<typeof markupCalculatorInputSchema>;
export type MarkupCalculatorOutput = z.infer<typeof markupCalculatorOutputSchema>;
