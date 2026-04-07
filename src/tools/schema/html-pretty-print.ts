import { z } from "zod";

export const htmlPrettyPrintInputSchema = z.object({
  html: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlPrettyPrintOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlPrettyPrintInputSchema;
export const toolOutputSchema = htmlPrettyPrintOutputSchema;

export type HtmlPrettyPrintInput = z.infer<typeof htmlPrettyPrintInputSchema>;
export type HtmlPrettyPrintOutput = z.infer<typeof htmlPrettyPrintOutputSchema>;
