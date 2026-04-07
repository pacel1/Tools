import { z } from "zod";

export const metaTagGeneratorInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalUrl: z.string().optional(),
  siteName: z.string().optional(),
  ogImage: z.string().optional()
});

export const metaTagGeneratorOutputSchema = z.object({
  snippet: z.string()
});

export const toolInputSchema = metaTagGeneratorInputSchema;
export const toolOutputSchema = metaTagGeneratorOutputSchema;

export type MetaTagGeneratorInput = z.infer<typeof metaTagGeneratorInputSchema>;
export type MetaTagGeneratorOutput = z.infer<typeof metaTagGeneratorOutputSchema>;
