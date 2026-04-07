import { z } from "zod";

export const textReverserInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const textReverserOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = textReverserInputSchema;
export const toolOutputSchema = textReverserOutputSchema;
export type TextReverserInput = z.infer<typeof textReverserInputSchema>;
export type TextReverserOutput = z.infer<typeof textReverserOutputSchema>;
