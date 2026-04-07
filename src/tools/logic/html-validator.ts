import { validateHtmlMarkup } from "@/lib/html-tools/core";
import { htmlValidatorInputSchema, htmlValidatorOutputSchema, type HtmlValidatorInput, type HtmlValidatorOutput } from "@/tools/schema/html-validator";

export function runHtmlValidator(input: HtmlValidatorInput): HtmlValidatorOutput {
  const parsed = htmlValidatorInputSchema.parse(input);
  const result = validateHtmlMarkup(parsed.html);
  return htmlValidatorOutputSchema.parse(result);
}

export const toolLogic = runHtmlValidator;
