import { z } from "zod";

export const imageToBase64InputSchema = z.object({
  sourceName: z.string().min(1),
  dataUrl: z.string().min(1)
});

export const imageToBase64OutputSchema = z.object({
  base64: z.string(),
  mimeType: z.string(),
  dataUrl: z.string()
});

export const toolInputSchema = imageToBase64InputSchema;
export const toolOutputSchema = imageToBase64OutputSchema;

export type ImageToBase64Input = z.infer<typeof imageToBase64InputSchema>;
export type ImageToBase64Output = z.infer<typeof imageToBase64OutputSchema>;
