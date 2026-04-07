import { z } from "zod";

export const lbsToKgConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid pounds value.") });
export const lbsToKgConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = lbsToKgConverterInputSchema;
export const toolOutputSchema = lbsToKgConverterOutputSchema;
export type LbsToKgConverterInput = z.infer<typeof lbsToKgConverterInputSchema>;
export type LbsToKgConverterOutput = z.infer<typeof lbsToKgConverterOutputSchema>;
