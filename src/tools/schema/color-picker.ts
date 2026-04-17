import { z } from "zod";

export const colorPickerInputSchema = z.object({
  hex: z.string().min(3)
});

export const colorPickerOutputSchema = z.object({
  hex: z.string(),
  rgb: z.string(),
  hsl: z.string()
});

export const toolInputSchema = colorPickerInputSchema;
export const toolOutputSchema = colorPickerOutputSchema;

export type ColorPickerInput = z.infer<typeof colorPickerInputSchema>;
export type ColorPickerOutput = z.infer<typeof colorPickerOutputSchema>;
