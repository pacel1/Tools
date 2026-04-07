import { daysBetweenDatesCalculatorInputSchema, daysBetweenDatesCalculatorOutputSchema, type DaysBetweenDatesCalculatorInput, type DaysBetweenDatesCalculatorOutput } from "@/tools/schema/days-between-dates-calculator";

export function runDaysBetweenDatesCalculator(input: DaysBetweenDatesCalculatorInput): DaysBetweenDatesCalculatorOutput {
  const parsed = daysBetweenDatesCalculatorInputSchema.parse(input);
  const startDate = new Date(parsed.startDate); const endDate = new Date(parsed.endDate); const result = Math.round((endDate.getTime() - startDate.getTime()) / 86400000); return daysBetweenDatesCalculatorOutputSchema.parse({ result, formatted: String(result), detail: "Difference in days" });
}

export const toolLogic = runDaysBetweenDatesCalculator;
