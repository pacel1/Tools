import { z } from "zod";

export const readingTimeCalculatorInputSchema = z.object({ text: z.string().min(1, "Enter text to analyze.") });
export const readingTimeCalculatorOutputSchema = z.object({ primary: z.number(), secondary: z.number(), tertiary: z.number(), formatted: z.string() });
export const toolInputSchema = readingTimeCalculatorInputSchema;
export const toolOutputSchema = readingTimeCalculatorOutputSchema;
export type ReadingTimeCalculatorInput = z.infer<typeof readingTimeCalculatorInputSchema>;
export type ReadingTimeCalculatorOutput = z.infer<typeof readingTimeCalculatorOutputSchema>;
