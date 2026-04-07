import { z } from "zod";

export const metersToFeetConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid meters value.") });
export const metersToFeetConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = metersToFeetConverterInputSchema;
export const toolOutputSchema = metersToFeetConverterOutputSchema;
export type MetersToFeetConverterInput = z.infer<typeof metersToFeetConverterInputSchema>;
export type MetersToFeetConverterOutput = z.infer<typeof metersToFeetConverterOutputSchema>;
