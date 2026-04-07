import { z } from "zod";

export const loanPaymentCalculatorInputSchema = z.object({
  principal: z.coerce.number().finite().min(0),
  annualRate: z.coerce.number().finite().min(0),
  termMonths: z.coerce.number().finite().min(0)
});
export const loanPaymentCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = loanPaymentCalculatorInputSchema;
export const toolOutputSchema = loanPaymentCalculatorOutputSchema;
export type LoanPaymentCalculatorInput = z.infer<typeof loanPaymentCalculatorInputSchema>;
export type LoanPaymentCalculatorOutput = z.infer<typeof loanPaymentCalculatorOutputSchema>;
