import { z } from "zod";

export const mmToInchesConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid millimeters value.") });
export const mmToInchesConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = mmToInchesConverterInputSchema;
export const toolOutputSchema = mmToInchesConverterOutputSchema;
export type MmToInchesConverterInput = z.infer<typeof mmToInchesConverterInputSchema>;
export type MmToInchesConverterOutput = z.infer<typeof mmToInchesConverterOutputSchema>;
