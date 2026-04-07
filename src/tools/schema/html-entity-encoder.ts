import { z } from "zod";

export const htmlEntityEncoderInputSchema = z.object({
  text: z
    .string()
    .min(1, "Paste source to process.")
});

export const htmlEntityEncoderOutputSchema = z.object({
  output: z.string(),
  characters: z.number().int().nonnegative()
});

export const toolInputSchema = htmlEntityEncoderInputSchema;
export const toolOutputSchema = htmlEntityEncoderOutputSchema;

export type HtmlEntityEncoderInput = z.infer<typeof htmlEntityEncoderInputSchema>;
export type HtmlEntityEncoderOutput = z.infer<typeof htmlEntityEncoderOutputSchema>;
