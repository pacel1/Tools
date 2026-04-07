import { z } from "zod";

export const kmToMilesConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid kilometers value.") });
export const kmToMilesConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = kmToMilesConverterInputSchema;
export const toolOutputSchema = kmToMilesConverterOutputSchema;
export type KmToMilesConverterInput = z.infer<typeof kmToMilesConverterInputSchema>;
export type KmToMilesConverterOutput = z.infer<typeof kmToMilesConverterOutputSchema>;
