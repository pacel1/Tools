import { textReverserInputSchema, textReverserOutputSchema, type TextReverserInput, type TextReverserOutput } from "@/tools/schema/text-reverser";

export function runTextReverser(input: TextReverserInput): TextReverserOutput {
  const parsed = textReverserInputSchema.parse(input);
  const result = parsed.text.split("").reverse().join("");
  return textReverserOutputSchema.parse({ result });
}

export const toolLogic = runTextReverser;
