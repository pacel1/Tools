import { z } from "zod";

export const daysBetweenDatesCalculatorInputSchema = z.object({ startDate: z.string().min(10), endDate: z.string().min(10) });
export const daysBetweenDatesCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = daysBetweenDatesCalculatorInputSchema;
export const toolOutputSchema = daysBetweenDatesCalculatorOutputSchema;
export type DaysBetweenDatesCalculatorInput = z.infer<typeof daysBetweenDatesCalculatorInputSchema>;
export type DaysBetweenDatesCalculatorOutput = z.infer<typeof daysBetweenDatesCalculatorOutputSchema>;
