import { z } from "zod";

export const gradientGeneratorInputSchema = z.object({
  gradientType: z.enum(["linear", "radial"]).default("linear"),
  angle: z.coerce.number().int().min(0).max(360).default(135),
  colorOne: z.string().min(4).default("#0f172a"),
  colorTwo: z.string().min(4).default("#22d3ee")
});

export const gradientGeneratorOutputSchema = z.object({
  css: z.string()
});

export const toolInputSchema = gradientGeneratorInputSchema;
export const toolOutputSchema = gradientGeneratorOutputSchema;

export type GradientGeneratorInput = z.infer<typeof gradientGeneratorInputSchema>;
export type GradientGeneratorOutput = z.infer<typeof gradientGeneratorOutputSchema>;
