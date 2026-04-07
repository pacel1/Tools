import { ageCalculatorInputSchema, ageCalculatorOutputSchema, type AgeCalculatorInput, type AgeCalculatorOutput } from "@/tools/schema/age-calculator";

export function runAgeCalculator(input: AgeCalculatorInput): AgeCalculatorOutput {
  const parsed = ageCalculatorInputSchema.parse(input);
  const birthDate = new Date(parsed.birthDate); const today = new Date(); let result = today.getFullYear() - birthDate.getFullYear(); const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate()); if (!hasBirthdayPassed) result -= 1; return ageCalculatorOutputSchema.parse({ result, formatted: String(result), detail: "Exact age in years" });
}

export const toolLogic = runAgeCalculator;
