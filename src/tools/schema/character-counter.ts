import { z } from "zod";

export const characterCounterInputSchema = z.object({ text: z.string().min(1, "Enter text to analyze.") });
export const characterCounterOutputSchema = z.object({ primary: z.number(), secondary: z.number(), tertiary: z.number(), formatted: z.string() });
export const toolInputSchema = characterCounterInputSchema;
export const toolOutputSchema = characterCounterOutputSchema;
export type CharacterCounterInput = z.infer<typeof characterCounterInputSchema>;
export type CharacterCounterOutput = z.infer<typeof characterCounterOutputSchema>;
