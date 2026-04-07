import { z } from "zod";

export const markdownToHtmlInputSchema = z.object({
  markdown: z.string().min(1, "Paste source to render.")
});

export const markdownToHtmlOutputSchema = z.object({
  sanitizedHtml: z.string(),
  linkCount: z.number().int().nonnegative(),
  imageCount: z.number().int().nonnegative()
});

export const toolInputSchema = markdownToHtmlInputSchema;
export const toolOutputSchema = markdownToHtmlOutputSchema;

export type MarkdownToHtmlInput = z.infer<typeof markdownToHtmlInputSchema>;
export type MarkdownToHtmlOutput = z.infer<typeof markdownToHtmlOutputSchema>;
