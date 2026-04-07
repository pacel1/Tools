import { z } from "zod";

export const percentageIncreaseCalculatorInputSchema = z.object({
  value: z.coerce.number().finite().min(0),
  percent: z.coerce.number().finite().min(0)
});
export const percentageIncreaseCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = percentageIncreaseCalculatorInputSchema;
export const toolOutputSchema = percentageIncreaseCalculatorOutputSchema;
export type PercentageIncreaseCalculatorInput = z.infer<typeof percentageIncreaseCalculatorInputSchema>;
export type PercentageIncreaseCalculatorOutput = z.infer<typeof percentageIncreaseCalculatorOutputSchema>;
