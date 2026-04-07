import { z } from "zod";

export const sha256GeneratorInputSchema = z.object({ text: z.string().min(1, "Enter text to hash.") });
export const sha256GeneratorOutputSchema = z.object({ hash: z.string() });
export const toolInputSchema = sha256GeneratorInputSchema;
export const toolOutputSchema = sha256GeneratorOutputSchema;
export type Sha256GeneratorInput = z.infer<typeof sha256GeneratorInputSchema>;
export type Sha256GeneratorOutput = z.infer<typeof sha256GeneratorOutputSchema>;
