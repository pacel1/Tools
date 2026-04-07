import { z } from "zod";

export const urlEncoderInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const urlEncoderOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = urlEncoderInputSchema;
export const toolOutputSchema = urlEncoderOutputSchema;
export type UrlEncoderInput = z.infer<typeof urlEncoderInputSchema>;
export type UrlEncoderOutput = z.infer<typeof urlEncoderOutputSchema>;
