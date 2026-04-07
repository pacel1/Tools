import { extractHtmlLinks } from "@/lib/html-tools/core";
import { htmlLinkExtractorInputSchema, htmlLinkExtractorOutputSchema, type HtmlLinkExtractorInput, type HtmlLinkExtractorOutput } from "@/tools/schema/html-link-extractor";

export function runHtmlLinkExtractor(input: HtmlLinkExtractorInput): HtmlLinkExtractorOutput {
  const parsed = htmlLinkExtractorInputSchema.parse(input);
  const links = extractHtmlLinks(parsed.html);

  return htmlLinkExtractorOutputSchema.parse({
    links,
    total: links.length
  });
}

export const toolLogic = runHtmlLinkExtractor;
