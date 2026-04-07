import { z } from "zod";

export const jsonFormatterInputSchema = z.object({
  json: z.string().min(2, "Paste valid JSON."),
  indent: z.coerce.number().int().min(2).max(8).default(2)
});

export const jsonFormatterOutputSchema = z.object({
  formatted: z.string(),
  minified: z.string(),
  lineCount: z.number()
});

export const toolInputSchema = jsonFormatterInputSchema;
export const toolOutputSchema = jsonFormatterOutputSchema;

export type JsonFormatterInput = z.infer<typeof jsonFormatterInputSchema>;
export type JsonFormatterOutput = z.infer<typeof jsonFormatterOutputSchema>;
