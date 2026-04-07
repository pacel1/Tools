import { z } from "zod";

export const htmlViewerInputSchema = z.object({
  html: z.string().min(1, "Paste source to render.")
});

export const htmlViewerOutputSchema = z.object({
  sanitizedHtml: z.string(),
  linkCount: z.number().int().nonnegative(),
  imageCount: z.number().int().nonnegative()
});

export const toolInputSchema = htmlViewerInputSchema;
export const toolOutputSchema = htmlViewerOutputSchema;

export type HtmlViewerInput = z.infer<typeof htmlViewerInputSchema>;
export type HtmlViewerOutput = z.infer<typeof htmlViewerOutputSchema>;
