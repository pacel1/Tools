import { z } from "zod";

export const urlDecoderInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const urlDecoderOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = urlDecoderInputSchema;
export const toolOutputSchema = urlDecoderOutputSchema;
export type UrlDecoderInput = z.infer<typeof urlDecoderInputSchema>;
export type UrlDecoderOutput = z.infer<typeof urlDecoderOutputSchema>;
