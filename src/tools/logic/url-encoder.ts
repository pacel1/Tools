import { urlEncoderInputSchema, urlEncoderOutputSchema, type UrlEncoderInput, type UrlEncoderOutput } from "@/tools/schema/url-encoder";

export function runUrlEncoder(input: UrlEncoderInput): UrlEncoderOutput {
  const parsed = urlEncoderInputSchema.parse(input);
  const result = encodeURIComponent(parsed.text);
  return urlEncoderOutputSchema.parse({ result });
}

export const toolLogic = runUrlEncoder;
