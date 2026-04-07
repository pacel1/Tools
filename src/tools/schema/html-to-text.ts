import { z } from "zod";

export const htmlToTextInputSchema = z.object({
  html: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlToTextOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlToTextInputSchema;
export const toolOutputSchema = htmlToTextOutputSchema;

export type HtmlToTextInput = z.infer<typeof htmlToTextInputSchema>;
export type HtmlToTextOutput = z.infer<typeof htmlToTextOutputSchema>;
