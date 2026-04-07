import { z } from "zod";

export const litersToGallonsConverterInputSchema = z.object({ value: z.coerce.number().finite().min(0, "Enter a valid liters value.") });
export const litersToGallonsConverterOutputSchema = z.object({ result: z.number(), formatted: z.string() });
export const toolInputSchema = litersToGallonsConverterInputSchema;
export const toolOutputSchema = litersToGallonsConverterOutputSchema;
export type LitersToGallonsConverterInput = z.infer<typeof litersToGallonsConverterInputSchema>;
export type LitersToGallonsConverterOutput = z.infer<typeof litersToGallonsConverterOutputSchema>;
