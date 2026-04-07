import { getFaviconSizes } from "@/lib/generator-tools/core";
import { faviconGeneratorInputSchema, faviconGeneratorOutputSchema, type FaviconGeneratorInput } from "@/tools/schema/favicon-generator";

export function runFaviconGenerator(input: FaviconGeneratorInput) {
  faviconGeneratorInputSchema.parse(input);
  const sizes = getFaviconSizes();
  return faviconGeneratorOutputSchema.parse({ sizes, total: sizes.length });
}

export const toolLogic = runFaviconGenerator;
