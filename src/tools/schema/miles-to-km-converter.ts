import { z } from "zod";

export const milesToKmConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid miles value.") });
export const milesToKmConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = milesToKmConverterInputSchema;
export const toolOutputSchema = milesToKmConverterOutputSchema;
export type MilesToKmConverterInput = z.infer<typeof milesToKmConverterInputSchema>;
export type MilesToKmConverterOutput = z.infer<typeof milesToKmConverterOutputSchema>;
