import { calculateTargetDimensions, buildDownloadName } from "@/lib/image-tools/core";
import { imageResizerInputSchema, imageResizerOutputSchema, type ImageResizerInput } from "@/tools/schema/image-resizer";

export function runImageResizer(input: ImageResizerInput) {
  const parsed = imageResizerInputSchema.parse(input);
  const size = calculateTargetDimensions(parsed);
  return imageResizerOutputSchema.parse({
    ...size,
    originalWidth: parsed.originalWidth,
    originalHeight: parsed.originalHeight,
    downloadName: buildDownloadName(parsed.sourceName, "resized", parsed.format)
  });
}

export const toolLogic = runImageResizer;
