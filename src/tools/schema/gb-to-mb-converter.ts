import { z } from "zod";

export const gbToMbConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid gigabytes value.") });
export const gbToMbConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = gbToMbConverterInputSchema;
export const toolOutputSchema = gbToMbConverterOutputSchema;
export type GbToMbConverterInput = z.infer<typeof gbToMbConverterInputSchema>;
export type GbToMbConverterOutput = z.infer<typeof gbToMbConverterOutputSchema>;
