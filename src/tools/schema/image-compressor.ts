import { z } from "zod";

export const imageCompressorInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  format: z.enum(["png", "jpeg", "webp"]).default("jpeg"),
  quality: z.coerce.number().min(0.1).max(0.95).default(0.75),
  originalBytes: z.coerce.number().int().min(0)
});

export const imageCompressorOutputSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  quality: z.number(),
  downloadName: z.string(),
  originalBytes: z.number().int().min(0)
});

export const toolInputSchema = imageCompressorInputSchema;
export const toolOutputSchema = imageCompressorOutputSchema;

export type ImageCompressorInput = z.infer<typeof imageCompressorInputSchema>;
export type ImageCompressorOutput = z.infer<typeof imageCompressorOutputSchema>;
