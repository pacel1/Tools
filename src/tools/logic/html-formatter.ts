import { formatHtmlDocument } from "@/lib/html-tools/core";
import { htmlFormatterInputSchema, htmlFormatterOutputSchema, type HtmlFormatterInput, type HtmlFormatterOutput } from "@/tools/schema/html-formatter";

export function runHtmlFormatter(input: HtmlFormatterInput): HtmlFormatterOutput {
  const parsed = htmlFormatterInputSchema.parse(input);
  const output = formatHtmlDocument(parsed.html, parsed.indentSize);

  return htmlFormatterOutputSchema.parse({
    output,
    lines: output.split("\n").length,
    characters: output.length
  });
}

export const toolLogic = runHtmlFormatter;
