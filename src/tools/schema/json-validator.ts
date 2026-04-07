import { z } from "zod";

export const jsonValidatorInputSchema = z.object({ source: z.string().min(1, "Enter JSON to process.") });
export const jsonValidatorOutputSchema = z.object({ valid: z.boolean(), result: z.string(), message: z.string() });
export const toolInputSchema = jsonValidatorInputSchema;
export const toolOutputSchema = jsonValidatorOutputSchema;
export type JsonValidatorInput = z.infer<typeof jsonValidatorInputSchema>;
export type JsonValidatorOutput = z.infer<typeof jsonValidatorOutputSchema>;
