import { extractHtmlImages, extractHtmlLinks, sanitizeHtmlMarkup } from "@/lib/html-tools/core";
import { htmlViewerInputSchema, htmlViewerOutputSchema, type HtmlViewerInput, type HtmlViewerOutput } from "@/tools/schema/html-viewer";

export function runHtmlViewer(input: HtmlViewerInput): HtmlViewerOutput {
  const parsed = htmlViewerInputSchema.parse(input);
  const sanitizedHtml = sanitizeHtmlMarkup(parsed.html, true);

  return htmlViewerOutputSchema.parse({
    sanitizedHtml,
    linkCount: extractHtmlLinks(sanitizedHtml).length,
    imageCount: extractHtmlImages(sanitizedHtml).length
  });
}

export const toolLogic = runHtmlViewer;
