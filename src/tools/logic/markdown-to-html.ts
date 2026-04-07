import { extractHtmlImages, extractHtmlLinks, convertMarkdownToHtml } from "@/lib/html-tools/core";
import { markdownToHtmlInputSchema, markdownToHtmlOutputSchema, type MarkdownToHtmlInput, type MarkdownToHtmlOutput } from "@/tools/schema/markdown-to-html";

export function runMarkdownToHtml(input: MarkdownToHtmlInput): MarkdownToHtmlOutput {
  const parsed = markdownToHtmlInputSchema.parse(input);
  const sanitizedHtml = convertMarkdownToHtml(parsed.markdown);

  return markdownToHtmlOutputSchema.parse({
    sanitizedHtml,
    linkCount: extractHtmlLinks(sanitizedHtml).length,
    imageCount: extractHtmlImages(sanitizedHtml).length
  });
}

export const toolLogic = runMarkdownToHtml;
