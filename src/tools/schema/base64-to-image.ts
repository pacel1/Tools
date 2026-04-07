import { z } from "zod";

export const base64ToImageInputSchema = z.object({
  value: z.string().min(1),
  format: z.enum(["png", "jpeg", "webp"]).default("png")
});

export const base64ToImageOutputSchema = z.object({
  dataUrl: z.string(),
  mimeType: z.string()
});

export const toolInputSchema = base64ToImageInputSchema;
export const toolOutputSchema = base64ToImageOutputSchema;

export type Base64ToImageInput = z.infer<typeof base64ToImageInputSchema>;
export type Base64ToImageOutput = z.infer<typeof base64ToImageOutputSchema>;
