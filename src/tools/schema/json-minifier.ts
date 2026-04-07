import { z } from "zod";

export const jsonMinifierInputSchema = z.object({ source: z.string().min(1, "Enter JSON to process.") });
export const jsonMinifierOutputSchema = z.object({ valid: z.boolean(), result: z.string(), message: z.string() });
export const toolInputSchema = jsonMinifierInputSchema;
export const toolOutputSchema = jsonMinifierOutputSchema;
export type JsonMinifierInput = z.infer<typeof jsonMinifierInputSchema>;
export type JsonMinifierOutput = z.infer<typeof jsonMinifierOutputSchema>;
