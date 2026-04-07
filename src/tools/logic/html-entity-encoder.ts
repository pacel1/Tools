import { encodeHtmlEntities } from "@/lib/html-tools/core";
import { htmlEntityEncoderInputSchema, htmlEntityEncoderOutputSchema, type HtmlEntityEncoderInput, type HtmlEntityEncoderOutput } from "@/tools/schema/html-entity-encoder";

export function runHtmlEntityEncoder(input: HtmlEntityEncoderInput): HtmlEntityEncoderOutput {
  const parsed = htmlEntityEncoderInputSchema.parse(input);
  const output = encodeHtmlEntities(parsed.text);

  return htmlEntityEncoderOutputSchema.parse({
    output,
    characters: output.length
  });
}

export const toolLogic = runHtmlEntityEncoder;
