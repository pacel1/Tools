import { z } from "zod";

export const hexToRgbConverterInputSchema = z.object({
  hex: z.string().min(3)
});

export const hexToRgbConverterOutputSchema = z.object({
  normalizedHex: z.string(),
  red: z.number().int().min(0).max(255),
  green: z.number().int().min(0).max(255),
  blue: z.number().int().min(0).max(255),
  rgb: z.string()
});

export const toolInputSchema = hexToRgbConverterInputSchema;
export const toolOutputSchema = hexToRgbConverterOutputSchema;

export type HexToRgbConverterInput = z.infer<typeof hexToRgbConverterInputSchema>;
export type HexToRgbConverterOutput = z.infer<typeof hexToRgbConverterOutputSchema>;
