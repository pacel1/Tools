import { z } from "zod";

const outputFormatSchema = z.enum(["png", "jpeg", "webp"]);

export const iconMakerInputSchema = z.object({
  sourceName: z.string().min(1),
  sourceDataUrl: z.string().min(1),
  size: z.coerce.number().int().min(64).max(1024),
  padding: z.coerce.number().min(0).max(40),
  background: z.string().min(4),
  format: outputFormatSchema
});

export const iconMakerOutputSchema = z.object({
  size: z.number().int().positive(),
  padding: z.number(),
  background: z.string(),
  format: outputFormatSchema,
  downloadName: z.string()
});

export const toolInputSchema = iconMakerInputSchema;
export const toolOutputSchema = iconMakerOutputSchema;

export type IconMakerInput = z.infer<typeof iconMakerInputSchema>;
export type IconMakerOutput = z.infer<typeof iconMakerOutputSchema>;
