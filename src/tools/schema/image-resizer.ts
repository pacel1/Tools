import { z } from "zod";

export const imageResizerInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  originalWidth: z.coerce.number().int().min(1),
  originalHeight: z.coerce.number().int().min(1),
  targetWidth: z.coerce.number().int().min(1),
  targetHeight: z.coerce.number().int().min(1),
  keepAspectRatio: z.boolean().default(true),
  format: z.enum(["png", "jpeg", "webp"]).default("png")
});

export const imageResizerOutputSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  originalWidth: z.number().int().positive(),
  originalHeight: z.number().int().positive(),
  downloadName: z.string()
});

export const toolInputSchema = imageResizerInputSchema;
export const toolOutputSchema = imageResizerOutputSchema;

export type ImageResizerInput = z.infer<typeof imageResizerInputSchema>;
export type ImageResizerOutput = z.infer<typeof imageResizerOutputSchema>;
