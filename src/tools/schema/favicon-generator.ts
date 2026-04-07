import { z } from "zod";

export const faviconGeneratorInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  format: z.enum(["png", "jpeg", "webp"]).default("png")
});

export const faviconGeneratorOutputSchema = z.object({
  sizes: z.array(z.number().int().positive()),
  total: z.number().int().nonnegative()
});

export const toolInputSchema = faviconGeneratorInputSchema;
export const toolOutputSchema = faviconGeneratorOutputSchema;

export type FaviconGeneratorInput = z.infer<typeof faviconGeneratorInputSchema>;
export type FaviconGeneratorOutput = z.infer<typeof faviconGeneratorOutputSchema>;
