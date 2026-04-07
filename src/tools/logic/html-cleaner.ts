import { cleanHtmlMarkup } from "@/lib/html-tools/core";
import { htmlCleanerInputSchema, htmlCleanerOutputSchema, type HtmlCleanerInput, type HtmlCleanerOutput } from "@/tools/schema/html-cleaner";

export function runHtmlCleaner(input: HtmlCleanerInput): HtmlCleanerOutput {
  const parsed = htmlCleanerInputSchema.parse(input);
  const output = cleanHtmlMarkup(parsed.html, parsed.indentSize, parsed.removeComments);

  return htmlCleanerOutputSchema.parse({
    output,
    lines: output.split("\n").length,
    characters: output.length
  });
}

export const toolLogic = runHtmlCleaner;
