import { z } from "zod";

export const percentageDecreaseCalculatorInputSchema = z.object({
  value: z.coerce.number().finite().min(0),
  percent: z.coerce.number().finite().min(0)
});
export const percentageDecreaseCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = percentageDecreaseCalculatorInputSchema;
export const toolOutputSchema = percentageDecreaseCalculatorOutputSchema;
export type PercentageDecreaseCalculatorInput = z.infer<typeof percentageDecreaseCalculatorInputSchema>;
export type PercentageDecreaseCalculatorOutput = z.infer<typeof percentageDecreaseCalculatorOutputSchema>;
