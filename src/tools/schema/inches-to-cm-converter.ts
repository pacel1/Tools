import { z } from "zod";

export const inchesToCmConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid inches value.") });
export const inchesToCmConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = inchesToCmConverterInputSchema;
export const toolOutputSchema = inchesToCmConverterOutputSchema;
export type InchesToCmConverterInput = z.infer<typeof inchesToCmConverterInputSchema>;
export type InchesToCmConverterOutput = z.infer<typeof inchesToCmConverterOutputSchema>;
