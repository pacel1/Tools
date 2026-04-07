import { z } from "zod";

export const uuidGeneratorInputSchema = z.object({ count: z.coerce.number().int().min(1).max(10).default(1) });
export const uuidGeneratorOutputSchema = z.object({ values: z.array(z.string()), formatted: z.string() });
export const toolInputSchema = uuidGeneratorInputSchema;
export const toolOutputSchema = uuidGeneratorOutputSchema;
export type UuidGeneratorInput = z.infer<typeof uuidGeneratorInputSchema>;
export type UuidGeneratorOutput = z.infer<typeof uuidGeneratorOutputSchema>;
