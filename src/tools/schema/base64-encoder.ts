import { z } from "zod";

export const base64EncoderInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const base64EncoderOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = base64EncoderInputSchema;
export const toolOutputSchema = base64EncoderOutputSchema;
export type Base64EncoderInput = z.infer<typeof base64EncoderInputSchema>;
export type Base64EncoderOutput = z.infer<typeof base64EncoderOutputSchema>;
