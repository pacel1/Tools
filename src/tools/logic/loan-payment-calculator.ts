import { loanPaymentCalculatorInputSchema, loanPaymentCalculatorOutputSchema, type LoanPaymentCalculatorInput, type LoanPaymentCalculatorOutput } from "@/tools/schema/loan-payment-calculator";

export function runLoanPaymentCalculator(input: LoanPaymentCalculatorInput): LoanPaymentCalculatorOutput {
  const parsed = loanPaymentCalculatorInputSchema.parse(input);
  const monthlyRate = parsed.annualRate / 100 / 12;
  const result =
    parsed.termMonths <= 0
      ? 0
      : monthlyRate === 0
        ? parsed.principal / parsed.termMonths
        : (parsed.principal * monthlyRate) /
          (1 - Math.pow(1 + monthlyRate, -parsed.termMonths));

  return loanPaymentCalculatorOutputSchema.parse({ result, formatted: result.toFixed(2), detail: "Calculated result" });
}

export const toolLogic = runLoanPaymentCalculator;
