import { buildMetaTagSnippet } from "@/lib/generator-tools/core";
import { metaTagGeneratorInputSchema, metaTagGeneratorOutputSchema, type MetaTagGeneratorInput } from "@/tools/schema/meta-tag-generator";

export function runMetaTagGenerator(input: MetaTagGeneratorInput) {
  const parsed = metaTagGeneratorInputSchema.parse(input);
  return metaTagGeneratorOutputSchema.parse({ snippet: buildMetaTagSnippet(parsed) });
}

export const toolLogic = runMetaTagGenerator;
