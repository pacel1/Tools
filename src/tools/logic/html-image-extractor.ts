import { extractHtmlImages } from "@/lib/html-tools/core";
import { htmlImageExtractorInputSchema, htmlImageExtractorOutputSchema, type HtmlImageExtractorInput, type HtmlImageExtractorOutput } from "@/tools/schema/html-image-extractor";

export function runHtmlImageExtractor(input: HtmlImageExtractorInput): HtmlImageExtractorOutput {
  const parsed = htmlImageExtractorInputSchema.parse(input);
  const images = extractHtmlImages(parsed.html);

  return htmlImageExtractorOutputSchema.parse({
    images,
    total: images.length
  });
}

export const toolLogic = runHtmlImageExtractor;
