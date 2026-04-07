import { z } from "zod";

export const feetToMetersConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid feet value.") });
export const feetToMetersConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = feetToMetersConverterInputSchema;
export const toolOutputSchema = feetToMetersConverterOutputSchema;
export type FeetToMetersConverterInput = z.infer<typeof feetToMetersConverterInputSchema>;
export type FeetToMetersConverterOutput = z.infer<typeof feetToMetersConverterOutputSchema>;
