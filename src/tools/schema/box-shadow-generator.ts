import { z } from "zod";

export const boxShadowGeneratorInputSchema = z.object({
  offsetX: z.coerce.number().int().min(-200).max(200).default(0),
  offsetY: z.coerce.number().int().min(-200).max(200).default(18),
  blur: z.coerce.number().int().min(0).max(200).default(36),
  spread: z.coerce.number().int().min(-200).max(200).default(0),
  color: z.string().min(4).default("#0f172a"),
  opacity: z.coerce.number().min(0).max(1).default(0.25),
  inset: z.boolean().default(false)
});

export const boxShadowGeneratorOutputSchema = z.object({
  css: z.string()
});

export const toolInputSchema = boxShadowGeneratorInputSchema;
export const toolOutputSchema = boxShadowGeneratorOutputSchema;

export type BoxShadowGeneratorInput = z.infer<typeof boxShadowGeneratorInputSchema>;
export type BoxShadowGeneratorOutput = z.infer<typeof boxShadowGeneratorOutputSchema>;
