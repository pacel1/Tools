import { z } from "zod";

const linkSchema = z.object({
  href: z.string(),
  text: z.string(),
  rel: z.string(),
  target: z.string()
});

export const htmlLinkExtractorInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to inspect.")
});

export const htmlLinkExtractorOutputSchema = z.object({
  links: z.array(linkSchema),
  total: z.number().int().nonnegative()
});

export const toolInputSchema = htmlLinkExtractorInputSchema;
export const toolOutputSchema = htmlLinkExtractorOutputSchema;

export type HtmlLinkExtractorInput = z.infer<typeof htmlLinkExtractorInputSchema>;
export type HtmlLinkExtractorOutput = z.infer<typeof htmlLinkExtractorOutputSchema>;
