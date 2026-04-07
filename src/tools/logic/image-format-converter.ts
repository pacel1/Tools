import { buildDownloadName, clampQuality } from "@/lib/image-tools/core";
import { imageFormatConverterInputSchema, imageFormatConverterOutputSchema, type ImageFormatConverterInput } from "@/tools/schema/image-format-converter";

export function runImageFormatConverter(input: ImageFormatConverterInput) {
  const parsed = imageFormatConverterInputSchema.parse(input);
  return imageFormatConverterOutputSchema.parse({
    width: parsed.width,
    height: parsed.height,
    targetFormat: parsed.targetFormat,
    quality: clampQuality(parsed.quality),
    downloadName: buildDownloadName(parsed.sourceName, "converted", parsed.targetFormat)
  });
}

export const toolLogic = runImageFormatConverter;
