import { slugGeneratorInputSchema, slugGeneratorOutputSchema, type SlugGeneratorInput, type SlugGeneratorOutput } from "@/tools/schema/slug-generator";

export function runSlugGenerator(input: SlugGeneratorInput): SlugGeneratorOutput {
  const parsed = slugGeneratorInputSchema.parse(input);
  const result = parsed.text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slugGeneratorOutputSchema.parse({ result });
}

export const toolLogic = runSlugGenerator;
