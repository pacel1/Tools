import { z } from "zod";

export const ageCalculatorInputSchema = z.object({ birthDate: z.string().min(10) });
export const ageCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = ageCalculatorInputSchema;
export const toolOutputSchema = ageCalculatorOutputSchema;
export type AgeCalculatorInput = z.infer<typeof ageCalculatorInputSchema>;
export type AgeCalculatorOutput = z.infer<typeof ageCalculatorOutputSchema>;
