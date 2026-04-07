import { removeExtraSpacesInputSchema, removeExtraSpacesOutputSchema, type RemoveExtraSpacesInput, type RemoveExtraSpacesOutput } from "@/tools/schema/remove-extra-spaces";

export function runRemoveExtraSpaces(input: RemoveExtraSpacesInput): RemoveExtraSpacesOutput {
  const parsed = removeExtraSpacesInputSchema.parse(input);
  const result = parsed.text.replace(/\s+/g, " ").trim();
  return removeExtraSpacesOutputSchema.parse({ result });
}

export const toolLogic = runRemoveExtraSpaces;
