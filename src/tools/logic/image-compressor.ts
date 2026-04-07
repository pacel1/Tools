import { buildDownloadName, clampQuality } from "@/lib/image-tools/core";
import { imageCompressorInputSchema, imageCompressorOutputSchema, type ImageCompressorInput } from "@/tools/schema/image-compressor";

export function runImageCompressor(input: ImageCompressorInput) {
  const parsed = imageCompressorInputSchema.parse(input);
  return imageCompressorOutputSchema.parse({
    width: parsed.width,
    height: parsed.height,
    quality: clampQuality(parsed.quality),
    originalBytes: parsed.originalBytes,
    downloadName: buildDownloadName(parsed.sourceName, "compressed", parsed.format)
  });
}

export const toolLogic = runImageCompressor;
