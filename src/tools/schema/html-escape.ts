import { z } from "zod";

export const htmlEscapeInputSchema = z.object({
  text: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlEscapeOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlEscapeInputSchema;
export const toolOutputSchema = htmlEscapeOutputSchema;

export type HtmlEscapeInput = z.infer<typeof htmlEscapeInputSchema>;
export type HtmlEscapeOutput = z.infer<typeof htmlEscapeOutputSchema>;
