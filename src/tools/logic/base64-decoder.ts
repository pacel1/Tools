import { base64DecoderInputSchema, base64DecoderOutputSchema, type Base64DecoderInput, type Base64DecoderOutput } from "@/tools/schema/base64-decoder";

export function runBase64Decoder(input: Base64DecoderInput): Base64DecoderOutput {
  const parsed = base64DecoderInputSchema.parse(input);
  let result = ""; try { const binary = atob(parsed.text); const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0)); result = new TextDecoder().decode(bytes); } catch { result = ""; }
  return base64DecoderOutputSchema.parse({ result });
}

export const toolLogic = runBase64Decoder;
