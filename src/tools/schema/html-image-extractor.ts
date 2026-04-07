import { z } from "zod";

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.string(),
  height: z.string()
});

export const htmlImageExtractorInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to inspect.")
});

export const htmlImageExtractorOutputSchema = z.object({
  images: z.array(imageSchema),
  total: z.number().int().nonnegative()
});

export const toolInputSchema = htmlImageExtractorInputSchema;
export const toolOutputSchema = htmlImageExtractorOutputSchema;

export type HtmlImageExtractorInput = z.infer<typeof htmlImageExtractorInputSchema>;
export type HtmlImageExtractorOutput = z.infer<typeof htmlImageExtractorOutputSchema>;
