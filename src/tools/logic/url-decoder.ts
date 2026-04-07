import { urlDecoderInputSchema, urlDecoderOutputSchema, type UrlDecoderInput, type UrlDecoderOutput } from "@/tools/schema/url-decoder";

export function runUrlDecoder(input: UrlDecoderInput): UrlDecoderOutput {
  const parsed = urlDecoderInputSchema.parse(input);
  let result = ""; try { result = decodeURIComponent(parsed.text); } catch { result = ""; }
  return urlDecoderOutputSchema.parse({ result });
}

export const toolLogic = runUrlDecoder;
