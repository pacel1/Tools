import { z } from "zod";

export const inchesToMmConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid inches value.") });
export const inchesToMmConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = inchesToMmConverterInputSchema;
export const toolOutputSchema = inchesToMmConverterOutputSchema;
export type InchesToMmConverterInput = z.infer<typeof inchesToMmConverterInputSchema>;
export type InchesToMmConverterOutput = z.infer<typeof inchesToMmConverterOutputSchema>;
