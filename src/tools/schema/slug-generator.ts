import { z } from "zod";

export const slugGeneratorInputSchema = z.object({ text: z.string().min(1, "Enter text to process.") });
export const slugGeneratorOutputSchema = z.object({ result: z.string() });
export const toolInputSchema = slugGeneratorInputSchema;
export const toolOutputSchema = slugGeneratorOutputSchema;
export type SlugGeneratorInput = z.infer<typeof slugGeneratorInputSchema>;
export type SlugGeneratorOutput = z.infer<typeof slugGeneratorOutputSchema>;
