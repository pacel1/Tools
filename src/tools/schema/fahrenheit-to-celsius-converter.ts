import { z } from "zod";

export const fahrenheitToCelsiusConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid fahrenheit value.") });
export const fahrenheitToCelsiusConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = fahrenheitToCelsiusConverterInputSchema;
export const toolOutputSchema = fahrenheitToCelsiusConverterOutputSchema;
export type FahrenheitToCelsiusConverterInput = z.infer<typeof fahrenheitToCelsiusConverterInputSchema>;
export type FahrenheitToCelsiusConverterOutput = z.infer<typeof fahrenheitToCelsiusConverterOutputSchema>;
