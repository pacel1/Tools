import { parseDataUrl } from "@/lib/image-tools/core";
import { imageToBase64InputSchema, imageToBase64OutputSchema, type ImageToBase64Input } from "@/tools/schema/image-to-base64";

export function runImageToBase64(input: ImageToBase64Input) {
  const parsed = imageToBase64InputSchema.parse(input);
  const data = parseDataUrl(parsed.dataUrl);
  return imageToBase64OutputSchema.parse({
    base64: data.base64,
    mimeType: data.mimeType,
    dataUrl: parsed.dataUrl
  });
}

export const toolLogic = runImageToBase64;
