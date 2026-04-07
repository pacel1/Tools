import { z } from "zod";

export const bmiCalculatorInputSchema = z.object({
  weightKg: z.coerce.number().finite().min(0),
  heightCm: z.coerce.number().finite().min(0)
});
export const bmiCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = bmiCalculatorInputSchema;
export const toolOutputSchema = bmiCalculatorOutputSchema;
export type BmiCalculatorInput = z.infer<typeof bmiCalculatorInputSchema>;
export type BmiCalculatorOutput = z.infer<typeof bmiCalculatorOutputSchema>;
