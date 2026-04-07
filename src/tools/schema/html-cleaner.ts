import { z } from "zod";

export const htmlCleanerInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to process."),
  indentSize: z.coerce.number().int().min(2).max(6).default(2),
  removeComments: z.boolean().default(true)
});

export const htmlCleanerOutputSchema = z.object({
  output: z.string(),
  lines: z.number().int().nonnegative(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlCleanerInputSchema;
export const toolOutputSchema = htmlCleanerOutputSchema;

export type HtmlCleanerInput = z.infer<typeof htmlCleanerInputSchema>;
export type HtmlCleanerOutput = z.infer<typeof htmlCleanerOutputSchema>;
