import { markupCalculatorInputSchema, markupCalculatorOutputSchema, type MarkupCalculatorInput, type MarkupCalculatorOutput } from "@/tools/schema/markup-calculator";

export function runMarkupCalculator(input: MarkupCalculatorInput): MarkupCalculatorOutput {
  const parsed = markupCalculatorInputSchema.parse(input);
  const result = parsed.cost * (1 + parsed.markupPercent / 100);
  return markupCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runMarkupCalculator;
