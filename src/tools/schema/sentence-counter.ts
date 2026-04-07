import { z } from "zod";

export const sentenceCounterInputSchema = z.object({ text: z.string().min(1, "Enter text to analyze.") });
export const sentenceCounterOutputSchema = z.object({ primary: z.number(), secondary: z.number(), tertiary: z.number(), formatted: z.string() });
export const toolInputSchema = sentenceCounterInputSchema;
export const toolOutputSchema = sentenceCounterOutputSchema;
export type SentenceCounterInput = z.infer<typeof sentenceCounterInputSchema>;
export type SentenceCounterOutput = z.infer<typeof sentenceCounterOutputSchema>;
