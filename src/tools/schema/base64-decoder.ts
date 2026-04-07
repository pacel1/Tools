import { z } from "zod";

export const base64DecoderInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const base64DecoderOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = base64DecoderInputSchema;
export const toolOutputSchema = base64DecoderOutputSchema;
export type Base64DecoderInput = z.infer<typeof base64DecoderInputSchema>;
export type Base64DecoderOutput = z.infer<typeof base64DecoderOutputSchema>;
