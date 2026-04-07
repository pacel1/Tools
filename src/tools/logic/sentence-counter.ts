import { sentenceCounterInputSchema, sentenceCounterOutputSchema, type SentenceCounterInput, type SentenceCounterOutput } from "@/tools/schema/sentence-counter";

export function runSentenceCounter(input: SentenceCounterInput): SentenceCounterOutput {
  const parsed = sentenceCounterInputSchema.parse(input);
  const primary = parsed.text.split(/[.!?]+/).map((segment) => segment.trim()).filter(Boolean).length; const secondary = parsed.text.trim() ? parsed.text.trim().split(/\s+/).length : 0; const tertiary = parsed.text.length;
  return sentenceCounterOutputSchema.parse({ primary, secondary, tertiary, formatted: String(primary) });
}

export const toolLogic = runSentenceCounter;
