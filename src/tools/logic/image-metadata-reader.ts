import { normalizeImageMetadata } from "@/lib/image-tools/core";
import { imageMetadataReaderInputSchema, imageMetadataReaderOutputSchema, type ImageMetadataReaderInput } from "@/tools/schema/image-metadata-reader";

export function runImageMetadataReader(input: ImageMetadataReaderInput) {
  const parsed = imageMetadataReaderInputSchema.parse(input);
  return imageMetadataReaderOutputSchema.parse(normalizeImageMetadata(parsed));
}

export const toolLogic = runImageMetadataReader;
