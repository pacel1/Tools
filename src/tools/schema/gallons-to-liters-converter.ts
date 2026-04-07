import { z } from "zod";

export const gallonsToLitersConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid gallons value.") });
export const gallonsToLitersConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = gallonsToLitersConverterInputSchema;
export const toolOutputSchema = gallonsToLitersConverterOutputSchema;
export type GallonsToLitersConverterInput = z.infer<typeof gallonsToLitersConverterInputSchema>;
export type GallonsToLitersConverterOutput = z.infer<typeof gallonsToLitersConverterOutputSchema>;
