import { z } from "zod";

export const keywordDensityCheckerInputSchema = z.object({
  text: z.string().min(1, "Enter text to analyze."),
  keyword: z.string().min(1, "Enter a keyword.")
});
export const keywordDensityCheckerOutputSchema = z.object({
  primary: z.number(),
  secondary: z.number(),
  tertiary: z.number(),
  formatted: z.string()
});
export const toolInputSchema = keywordDensityCheckerInputSchema;
export const toolOutputSchema = keywordDensityCheckerOutputSchema;
export type KeywordDensityCheckerInput = z.infer<typeof keywordDensityCheckerInputSchema>;
export type KeywordDensityCheckerOutput = z.infer<typeof keywordDensityCheckerOutputSchema>;
