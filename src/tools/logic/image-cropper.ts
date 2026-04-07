import { buildDownloadName, normalizeCropRect } from "@/lib/image-tools/core";
import { imageCropperInputSchema, imageCropperOutputSchema, type ImageCropperInput } from "@/tools/schema/image-cropper";

export function runImageCropper(input: ImageCropperInput) {
  const parsed = imageCropperInputSchema.parse(input);
  const crop = normalizeCropRect(parsed);
  return imageCropperOutputSchema.parse({
    crop,
    width: crop.width,
    height: crop.height,
    downloadName: buildDownloadName(parsed.sourceName, "cropped", parsed.format)
  });
}

export const toolLogic = runImageCropper;
