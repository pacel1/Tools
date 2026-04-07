import { z } from "zod";

export const lineCounterInputSchema = z.object({ text: z.string().min(1, "Enter text to analyze.") });
export const lineCounterOutputSchema = z.object({ primary: z.number(), secondary: z.number(), tertiary: z.number(), formatted: z.string() });
export const toolInputSchema = lineCounterInputSchema;
export const toolOutputSchema = lineCounterOutputSchema;
export type LineCounterInput = z.infer<typeof lineCounterInputSchema>;
export type LineCounterOutput = z.infer<typeof lineCounterOutputSchema>;
