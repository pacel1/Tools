import { z } from "zod";

const issueSchema = z.object({
  severity: z.enum(["error", "warning"]),
  message: z.string(),
  context: z.string().optional(),
  suggestion: z.string().optional()
});

export const htmlValidatorInputSchema = z.object({
  html: z.string().min(1, "Paste HTML to validate.")
});

export const htmlValidatorOutputSchema = z.object({
  isValid: z.boolean(),
  issues: z.array(issueSchema),
  errorCount: z.number().int().nonnegative(),
  warningCount: z.number().int().nonnegative()
});

export const toolInputSchema = htmlValidatorInputSchema;
export const toolOutputSchema = htmlValidatorOutputSchema;

export type HtmlValidatorInput = z.infer<typeof htmlValidatorInputSchema>;
export type HtmlValidatorOutput = z.infer<typeof htmlValidatorOutputSchema>;
