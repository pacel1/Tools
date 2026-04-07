import { base64EncoderInputSchema, base64EncoderOutputSchema, type Base64EncoderInput, type Base64EncoderOutput } from "@/tools/schema/base64-encoder";

export function runBase64Encoder(input: Base64EncoderInput): Base64EncoderOutput {
  const parsed = base64EncoderInputSchema.parse(input);
  const bytes = new TextEncoder().encode(parsed.text); let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); const result = btoa(binary);
  return base64EncoderOutputSchema.parse({ result });
}

export const toolLogic = runBase64Encoder;
