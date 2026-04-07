import { htmlToText } from "@/lib/html-tools/core";
import { htmlToTextInputSchema, htmlToTextOutputSchema, type HtmlToTextInput, type HtmlToTextOutput } from "@/tools/schema/html-to-text";

export function runHtmlToText(input: HtmlToTextInput): HtmlToTextOutput {
  const parsed = htmlToTextInputSchema.parse(input);
  const output = htmlToText(parsed.html);

  return htmlToTextOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlToText;
