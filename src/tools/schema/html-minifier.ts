import { z } from "zod";

export const htmlMinifierInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to minify.")
});

export const htmlMinifierOutputSchema = z.object({
  minifiedHtml: z.string(),
  characters: z.number().int().nonnegative(),
  savedCharacters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlMinifierInputSchema;
export const toolOutputSchema = htmlMinifierOutputSchema;

export type HtmlMinifierInput = z.infer<typeof htmlMinifierInputSchema>;
export type HtmlMinifierOutput = z.infer<typeof htmlMinifierOutputSchema>;
