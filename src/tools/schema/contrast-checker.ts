import { z } from "zod";

export const contrastCheckerInputSchema = z.object({
  foreground: z.string().min(3),
  background: z.string().min(3)
});

export const contrastCheckerOutputSchema = z.object({
  ratio: z.number(),
  summary: z.string(),
  aaNormal: z.boolean(),
  aaaNormal: z.boolean(),
  aaLarge: z.boolean()
});

export const toolInputSchema = contrastCheckerInputSchema;
export const toolOutputSchema = contrastCheckerOutputSchema;

export type ContrastCheckerInput = z.infer<typeof contrastCheckerInputSchema>;
export type ContrastCheckerOutput = z.infer<typeof contrastCheckerOutputSchema>;
