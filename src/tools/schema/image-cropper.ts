import { z } from "zod";

export const imageCropperInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  imageWidth: z.coerce.number().int().min(1),
  imageHeight: z.coerce.number().int().min(1),
  x: z.coerce.number().int().min(0),
  y: z.coerce.number().int().min(0),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  format: z.enum(["png", "jpeg", "webp"]).default("png")
});

export const imageCropperOutputSchema = z.object({
  crop: z.object({ x: z.number().int(), y: z.number().int(), width: z.number().int(), height: z.number().int() }),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  downloadName: z.string()
});

export const toolInputSchema = imageCropperInputSchema;
export const toolOutputSchema = imageCropperOutputSchema;

export type ImageCropperInput = z.infer<typeof imageCropperInputSchema>;
export type ImageCropperOutput = z.infer<typeof imageCropperOutputSchema>;
