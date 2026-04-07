import { escapeHtmlText } from "@/lib/html-tools/core";
import { htmlEscapeInputSchema, htmlEscapeOutputSchema, type HtmlEscapeInput, type HtmlEscapeOutput } from "@/tools/schema/html-escape";

export function runHtmlEscape(input: HtmlEscapeInput): HtmlEscapeOutput {
  const parsed = htmlEscapeInputSchema.parse(input);
  const output = escapeHtmlText(parsed.text);

  return htmlEscapeOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlEscape;
