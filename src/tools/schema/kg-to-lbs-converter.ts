import { z } from "zod";

export const kgToLbsInputSchema = z.object({
  kilograms: z.coerce.number().min(0, "Kilograms must be greater than or equal to 0.")
});

export const kgToLbsOutputSchema = z.object({
  pounds: z.number(),
  formatted: z.string()
});

export const toolInputSchema = kgToLbsInputSchema;
export const toolOutputSchema = kgToLbsOutputSchema;

export type KgToLbsInput = z.infer<typeof kgToLbsInputSchema>;
export type KgToLbsOutput = z.infer<typeof kgToLbsOutputSchema>;
