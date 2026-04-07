import { z } from "zod";

export const imageFormatConverterInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  targetFormat: z.enum(["png", "jpeg", "webp"]).default("webp"),
  quality: z.coerce.number().min(0.1).max(0.95).default(0.82)
});

export const imageFormatConverterOutputSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  targetFormat: z.enum(["png", "jpeg", "webp"]),
  quality: z.number(),
  downloadName: z.string()
});

export const toolInputSchema = imageFormatConverterInputSchema;
export const toolOutputSchema = imageFormatConverterOutputSchema;

export type ImageFormatConverterInput = z.infer<typeof imageFormatConverterInputSchema>;
export type ImageFormatConverterOutput = z.infer<typeof imageFormatConverterOutputSchema>;
