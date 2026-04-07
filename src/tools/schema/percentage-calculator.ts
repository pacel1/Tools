import { z } from "zod";

export const percentageCalculatorInputSchema = z.object({
  value: z.coerce.number().finite().min(0),
  total: z.coerce.number().finite().min(0)
});
export const percentageCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = percentageCalculatorInputSchema;
export const toolOutputSchema = percentageCalculatorOutputSchema;
export type PercentageCalculatorInput = z.infer<typeof percentageCalculatorInputSchema>;
export type PercentageCalculatorOutput = z.infer<typeof percentageCalculatorOutputSchema>;
