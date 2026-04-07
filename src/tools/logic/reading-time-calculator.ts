import { readingTimeCalculatorInputSchema, readingTimeCalculatorOutputSchema, type ReadingTimeCalculatorInput, type ReadingTimeCalculatorOutput } from "@/tools/schema/reading-time-calculator";

export function runReadingTimeCalculator(input: ReadingTimeCalculatorInput): ReadingTimeCalculatorOutput {
  const parsed = readingTimeCalculatorInputSchema.parse(input);
  const words = parsed.text.trim() ? parsed.text.trim().split(/\s+/).length : 0; const primary = Number((words / 200).toFixed(2)); const secondary = words; const tertiary = parsed.text.length;
  return readingTimeCalculatorOutputSchema.parse({ primary, secondary, tertiary, formatted: String(primary) });
}

export const toolLogic = runReadingTimeCalculator;
