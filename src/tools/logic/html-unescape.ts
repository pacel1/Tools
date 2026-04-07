import { unescapeHtmlText } from "@/lib/html-tools/core";
import { htmlUnescapeInputSchema, htmlUnescapeOutputSchema, type HtmlUnescapeInput, type HtmlUnescapeOutput } from "@/tools/schema/html-unescape";

export function runHtmlUnescape(input: HtmlUnescapeInput): HtmlUnescapeOutput {
  const parsed = htmlUnescapeInputSchema.parse(input);
  const output = unescapeHtmlText(parsed.text);

  return htmlUnescapeOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlUnescape;
