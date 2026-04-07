import { buildBoxShadowCss } from "@/lib/generator-tools/core";
import { boxShadowGeneratorInputSchema, boxShadowGeneratorOutputSchema, type BoxShadowGeneratorInput } from "@/tools/schema/box-shadow-generator";

export function runBoxShadowGenerator(input: BoxShadowGeneratorInput) {
  const parsed = boxShadowGeneratorInputSchema.parse(input);
  return boxShadowGeneratorOutputSchema.parse({ css: buildBoxShadowCss(parsed) });
}

export const toolLogic = runBoxShadowGenerator;
