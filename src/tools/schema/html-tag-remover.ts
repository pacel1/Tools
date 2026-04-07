import { z } from "zod";

export const htmlTagRemoverInputSchema = z.object({
  html: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlTagRemoverOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlTagRemoverInputSchema;
export const toolOutputSchema = htmlTagRemoverOutputSchema;

export type HtmlTagRemoverInput = z.infer<typeof htmlTagRemoverInputSchema>;
export type HtmlTagRemoverOutput = z.infer<typeof htmlTagRemoverOutputSchema>;
