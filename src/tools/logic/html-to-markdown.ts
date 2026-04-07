import { convertHtmlToMarkdown } from "@/lib/html-tools/core";
import { htmlToMarkdownInputSchema, htmlToMarkdownOutputSchema, type HtmlToMarkdownInput, type HtmlToMarkdownOutput } from "@/tools/schema/html-to-markdown";

export function runHtmlToMarkdown(input: HtmlToMarkdownInput): HtmlToMarkdownOutput {
  const parsed = htmlToMarkdownInputSchema.parse(input);
  const output = convertHtmlToMarkdown(parsed.html);

  return htmlToMarkdownOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlToMarkdown;
