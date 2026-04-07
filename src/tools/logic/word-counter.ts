import {
  wordCounterInputSchema,
  wordCounterOutputSchema
} from "@/tools/schema/word-counter";

export function countWords(input: unknown) {
  const parsed = wordCounterInputSchema.parse(input);
  const trimmed = parsed.text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = parsed.text.length;
  const charactersNoSpaces = parsed.text.replace(/\s+/g, "").length;
  const paragraphs = parsed.text
    .split(/\n\s*\n/)
    .map((segment) => segment.trim())
    .filter(Boolean).length;
  const readingTimeMinutes = words === 0 ? 0 : Number((words / 200).toFixed(2));

  return wordCounterOutputSchema.parse({
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    readingTimeMinutes
  });
}

export const toolLogic = countWords;
