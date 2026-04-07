import { buildGradientCss } from "@/lib/generator-tools/core";
import { gradientGeneratorInputSchema, gradientGeneratorOutputSchema, type GradientGeneratorInput } from "@/tools/schema/gradient-generator";

export function runGradientGenerator(input: GradientGeneratorInput) {
  const parsed = gradientGeneratorInputSchema.parse(input);
  return gradientGeneratorOutputSchema.parse({ css: buildGradientCss(parsed) });
}

export const toolLogic = runGradientGenerator;
