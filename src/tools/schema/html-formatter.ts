import { z } from "zod";

export const htmlFormatterInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to process."),
  indentSize: z.coerce.number().int().min(2).max(6).default(2),
  
});

export const htmlFormatterOutputSchema = z.object({
  output: z.string(),
  lines: z.number().int().nonnegative(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlFormatterInputSchema;
export const toolOutputSchema = htmlFormatterOutputSchema;

export type HtmlFormatterInput = z.infer<typeof htmlFormatterInputSchema>;
export type HtmlFormatterOutput = z.infer<typeof htmlFormatterOutputSchema>;
