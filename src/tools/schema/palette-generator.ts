import { z } from "zod";

export const paletteGeneratorInputSchema = z.object({
  baseColor: z.string().min(3),
  count: z.coerce.number().int().min(3).max(8)
});

export const paletteGeneratorOutputSchema = z.object({
  palette: z.array(z.string()),
  baseColor: z.string()
});

export const toolInputSchema = paletteGeneratorInputSchema;
export const toolOutputSchema = paletteGeneratorOutputSchema;

export type PaletteGeneratorInput = z.infer<typeof paletteGeneratorInputSchema>;
export type PaletteGeneratorOutput = z.infer<typeof paletteGeneratorOutputSchema>;
