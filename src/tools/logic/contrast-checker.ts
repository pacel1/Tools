import { getContrastRatio } from "@/lib/color-tools/core";
import {
  contrastCheckerInputSchema,
  contrastCheckerOutputSchema,
  type ContrastCheckerInput,
  type ContrastCheckerOutput
} from "@/tools/schema/contrast-checker";

export function runContrastChecker(
  input: ContrastCheckerInput
): ContrastCheckerOutput {
  const parsed = contrastCheckerInputSchema.parse(input);
  const ratio = getContrastRatio(parsed.foreground, parsed.background);
  const aaNormal = ratio >= 4.5;
  const aaaNormal = ratio >= 7;
  const aaLarge = ratio >= 3;

  return contrastCheckerOutputSchema.parse({
    ratio,
    summary: aaNormal ? "Passes normal text AA" : aaLarge ? "Passes large text AA" : "Needs more contrast",
    aaNormal,
    aaaNormal,
    aaLarge
  });
}

export const toolLogic = runContrastChecker;
