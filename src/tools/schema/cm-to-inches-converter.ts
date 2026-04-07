import { z } from "zod";

export const cmToInchesConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid centimeters value.") });
export const cmToInchesConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = cmToInchesConverterInputSchema;
export const toolOutputSchema = cmToInchesConverterOutputSchema;
export type CmToInchesConverterInput = z.infer<typeof cmToInchesConverterInputSchema>;
export type CmToInchesConverterOutput = z.infer<typeof cmToInchesConverterOutputSchema>;
