import { z } from "zod";

export const celsiusToFahrenheitConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid celsius value.") });
export const celsiusToFahrenheitConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = celsiusToFahrenheitConverterInputSchema;
export const toolOutputSchema = celsiusToFahrenheitConverterOutputSchema;
export type CelsiusToFahrenheitConverterInput = z.infer<typeof celsiusToFahrenheitConverterInputSchema>;
export type CelsiusToFahrenheitConverterOutput = z.infer<typeof celsiusToFahrenheitConverterOutputSchema>;
