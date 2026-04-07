import { z } from "zod";

export const qrCodeGeneratorInputSchema = z.object({
  text: z.string().min(1, "Enter text or a URL."),
  size: z.coerce.number().int().min(128).max(1024).default(320),
  margin: z.coerce.number().int().min(0).max(8).default(1),
  errorCorrectionLevel: z.enum(["L", "M", "Q", "H"]).default("M"),
  foreground: z.string().min(4).default("#111827"),
  background: z.string().min(4).default("#ffffff")
});

export const qrCodeGeneratorOutputSchema = z.object({
  svg: z.string(),
  downloadName: z.string()
});

export const toolInputSchema = qrCodeGeneratorInputSchema;
export const toolOutputSchema = qrCodeGeneratorOutputSchema;

export type QrCodeGeneratorInput = z.infer<typeof qrCodeGeneratorInputSchema>;
export type QrCodeGeneratorOutput = z.infer<typeof qrCodeGeneratorOutputSchema>;
