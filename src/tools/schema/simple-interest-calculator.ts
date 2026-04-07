import { z } from "zod";

export const simpleInterestCalculatorInputSchema = z.object({
  principal: z.coerce.number().finite().min(0),
  annualRate: z.coerce.number().finite().min(0),
  years: z.coerce.number().finite().min(0)
});
export const simpleInterestCalculatorOutputSchema = z.object({ result: z.number(), formatted: z.string(), detail: z.string() });
export const toolInputSchema = simpleInterestCalculatorInputSchema;
export const toolOutputSchema = simpleInterestCalculatorOutputSchema;
export type SimpleInterestCalculatorInput = z.infer<typeof simpleInterestCalculatorInputSchema>;
export type SimpleInterestCalculatorOutput = z.infer<typeof simpleInterestCalculatorOutputSchema>;
