import { z } from "zod";

export const placeholderImageGeneratorInputSchema = z.object({
  width: z.coerce.number().int().min(1).max(4000).default(1200),
  height: z.coerce.number().int().min(1).max(4000).default(630),
  background: z.string().min(4).default("#0f172a"),
  foreground: z.string().min(4).default("#f8fafc"),
  text: z.string().min(1).default("1200x630"),
  format: z.enum(["png", "jpeg", "webp"]).default("png")
});

export const placeholderImageGeneratorOutputSchema = z.object({
  filename: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

export const toolInputSchema = placeholderImageGeneratorInputSchema;
export const toolOutputSchema = placeholderImageGeneratorOutputSchema;

export type PlaceholderImageGeneratorInput = z.infer<typeof placeholderImageGeneratorInputSchema>;
export type PlaceholderImageGeneratorOutput = z.infer<typeof placeholderImageGeneratorOutputSchema>;
