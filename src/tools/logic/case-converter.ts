import { caseConverterInputSchema, caseConverterOutputSchema, type CaseConverterInput, type CaseConverterOutput } from "@/tools/schema/case-converter";

function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function toSentenceCase(value: string) {
  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function runCaseConverter(input: CaseConverterInput): CaseConverterOutput {
  const parsed = caseConverterInputSchema.parse(input);
  return caseConverterOutputSchema.parse({
    upper: parsed.text.toUpperCase(),
    lower: parsed.text.toLowerCase(),
    title: toTitleCase(parsed.text),
    sentence: toSentenceCase(parsed.text)
  });
}

export const toolLogic = runCaseConverter;
