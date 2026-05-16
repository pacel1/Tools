import { z } from "zod";

export const randomTokenGeneratorInputSchema = z.object({
  length: z.coerce.number().int().min(8).max(256).default(32),
  count: z.coerce.number().int().min(1).max(20).default(1),
  format: z.enum(["base64url", "hex", "alphanumeric"]).default("base64url"),
  prefix: z.string().max(32).default("")
});

export const randomTokenGeneratorOutputSchema = z.object({
  tokens: z.array(z.string()),
  formatted: z.string(),
  length: z.number(),
  format: z.enum(["base64url", "hex", "alphanumeric"])
});

export const toolInputSchema = randomTokenGeneratorInputSchema;
export const toolOutputSchema = randomTokenGeneratorOutputSchema;

export type RandomTokenGeneratorInput = z.infer<typeof randomTokenGeneratorInputSchema>;
export type RandomTokenGeneratorOutput = z.infer<typeof randomTokenGeneratorOutputSchema>;
