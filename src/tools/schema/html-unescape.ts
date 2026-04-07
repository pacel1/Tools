import { z } from "zod";

export const htmlUnescapeInputSchema = z.object({
  text: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlUnescapeOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlUnescapeInputSchema;
export const toolOutputSchema = htmlUnescapeOutputSchema;

export type HtmlUnescapeInput = z.infer<typeof htmlUnescapeInputSchema>;
export type HtmlUnescapeOutput = z.infer<typeof htmlUnescapeOutputSchema>;
