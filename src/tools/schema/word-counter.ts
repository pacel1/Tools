import { z } from "zod";

export const wordCounterInputSchema = z.object({
  text: z.string().min(1, "Text cannot be empty.")
});

export const wordCounterOutputSchema = z.object({
  words: z.number(),
  characters: z.number(),
  charactersNoSpaces: z.number(),
  paragraphs: z.number(),
  readingTimeMinutes: z.number()
});

export const toolInputSchema = wordCounterInputSchema;
export const toolOutputSchema = wordCounterOutputSchema;

export type WordCounterInput = z.infer<typeof wordCounterInputSchema>;
export type WordCounterOutput = z.infer<typeof wordCounterOutputSchema>;
