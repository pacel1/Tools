import { z } from "zod";

export const compoundInterestCalculatorInputSchema = z.object({
  principal: z.coerce.number().finite().min(0),
  annualRate: z.coerce.number().finite().min(0),
  years: z.coerce.number().finite().min(0),
  compoundsPerYear: z.coerce.number().finite().min(0)
});
export const compoundInterestCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = compoundInterestCalculatorInputSchema;
export const toolOutputSchema = compoundInterestCalculatorOutputSchema;
export type CompoundInterestCalculatorInput = z.infer<typeof compoundInterestCalculatorInputSchema>;
export type CompoundInterestCalculatorOutput = z.infer<typeof compoundInterestCalculatorOutputSchema>;
