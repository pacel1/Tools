import { getOutputMimeType, normalizeBase64ToDataUrl, parseDataUrl } from "@/lib/image-tools/core";
import { base64ToImageInputSchema, base64ToImageOutputSchema, type Base64ToImageInput } from "@/tools/schema/base64-to-image";

export function runBase64ToImage(input: Base64ToImageInput) {
  const parsed = base64ToImageInputSchema.parse(input);
  const dataUrl = normalizeBase64ToDataUrl(parsed.value, parsed.format);
  const data = parseDataUrl(dataUrl);
  return base64ToImageOutputSchema.parse({
    dataUrl,
    mimeType: data.mimeType || getOutputMimeType(parsed.format)
  });
}

export const toolLogic = runBase64ToImage;
