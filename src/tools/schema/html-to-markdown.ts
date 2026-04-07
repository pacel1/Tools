import { z } from "zod";

export const htmlToMarkdownInputSchema = z.object({
  html: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlToMarkdownOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlToMarkdownInputSchema;
export const toolOutputSchema = htmlToMarkdownOutputSchema;

export type HtmlToMarkdownInput = z.infer<typeof htmlToMarkdownInputSchema>;
export type HtmlToMarkdownOutput = z.infer<typeof htmlToMarkdownOutputSchema>;
