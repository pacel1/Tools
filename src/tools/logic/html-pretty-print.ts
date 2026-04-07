import { prettyPrintHtmlDocument } from "@/lib/html-tools/core";
import { htmlPrettyPrintInputSchema, htmlPrettyPrintOutputSchema, type HtmlPrettyPrintInput, type HtmlPrettyPrintOutput } from "@/tools/schema/html-pretty-print";

export function runHtmlPrettyPrint(input: HtmlPrettyPrintInput): HtmlPrettyPrintOutput {
  const parsed = htmlPrettyPrintInputSchema.parse(input);
  const output = prettyPrintHtmlDocument(parsed.html);

  return htmlPrettyPrintOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlPrettyPrint;
