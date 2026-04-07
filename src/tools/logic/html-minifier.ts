import { minifyHtmlDocument } from "@/lib/html-tools/core";
import { htmlMinifierInputSchema, htmlMinifierOutputSchema, type HtmlMinifierInput, type HtmlMinifierOutput } from "@/tools/schema/html-minifier";

export async function runHtmlMinifier(input: HtmlMinifierInput): Promise<HtmlMinifierOutput> {
  const parsed = htmlMinifierInputSchema.parse(input);
  const minifiedHtml = await minifyHtmlDocument(parsed.html);

  return htmlMinifierOutputSchema.parse({
    minifiedHtml,
    characters: minifiedHtml.length,
    savedCharacters: Math.max(parsed.html.length - minifiedHtml.length, 0)
  });
}

export const toolLogic = runHtmlMinifier;
