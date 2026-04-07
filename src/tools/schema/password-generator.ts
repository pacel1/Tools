import { z } from "zod";

export const passwordGeneratorInputSchema = z.object({
  length: z.coerce.number().int().min(4).max(64),
  uppercase: z.boolean().default(true),
  lowercase: z.boolean().default(true),
  numbers: z.boolean().default(true),
  symbols: z.boolean().default(false)
});
export const passwordGeneratorOutputSchema = z.object({ password: z.string(), length: z.number() });
export const toolInputSchema = passwordGeneratorInputSchema;
export const toolOutputSchema = passwordGeneratorOutputSchema;
export type PasswordGeneratorInput = z.infer<typeof passwordGeneratorInputSchema>;
export type PasswordGeneratorOutput = z.infer<typeof passwordGeneratorOutputSchema>;
