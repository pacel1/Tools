import { buildPlaceholderFilename } from "@/lib/generator-tools/core";
import { getOutputExtension } from "@/lib/image-tools/core";
import { placeholderImageGeneratorInputSchema, placeholderImageGeneratorOutputSchema, type PlaceholderImageGeneratorInput } from "@/tools/schema/placeholder-image-generator";

export function runPlaceholderImageGenerator(input: PlaceholderImageGeneratorInput) {
  const parsed = placeholderImageGeneratorInputSchema.parse(input);
  return placeholderImageGeneratorOutputSchema.parse({
    filename: buildPlaceholderFilename(parsed.width, parsed.height, getOutputExtension(parsed.format)),
    width: parsed.width,
    height: parsed.height
  });
}

export const toolLogic = runPlaceholderImageGenerator;
