import { lineCounterInputSchema, lineCounterOutputSchema, type LineCounterInput, type LineCounterOutput } from "@/tools/schema/line-counter";

export function runLineCounter(input: LineCounterInput): LineCounterOutput {
  const parsed = lineCounterInputSchema.parse(input);
  const lines = parsed.text.split(/\r?\n/); const primary = lines.length; const secondary = lines.filter((line) => line.trim().length > 0).length; const tertiary = parsed.text.length;
  return lineCounterOutputSchema.parse({ primary, secondary, tertiary, formatted: String(primary) });
}

export const toolLogic = runLineCounter;
