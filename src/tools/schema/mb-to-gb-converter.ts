import { z } from "zod";

export const mbToGbConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid megabytes value.") });
export const mbToGbConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = mbToGbConverterInputSchema;
export const toolOutputSchema = mbToGbConverterOutputSchema;
export type MbToGbConverterInput = z.infer<typeof mbToGbConverterInputSchema>;
export type MbToGbConverterOutput = z.infer<typeof mbToGbConverterOutputSchema>;
