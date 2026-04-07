import { stripHtmlTags } from "@/lib/html-tools/core";
import { htmlTagRemoverInputSchema, htmlTagRemoverOutputSchema, type HtmlTagRemoverInput, type HtmlTagRemoverOutput } from "@/tools/schema/html-tag-remover";

export function runHtmlTagRemover(input: HtmlTagRemoverInput): HtmlTagRemoverOutput {
  const parsed = htmlTagRemoverInputSchema.parse(input);
  const output = stripHtmlTags(parsed.html);

  return htmlTagRemoverOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlTagRemover;
