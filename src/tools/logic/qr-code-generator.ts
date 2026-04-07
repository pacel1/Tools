import { generateQrCodeSvg } from "@/lib/generator-tools/core";
import { qrCodeGeneratorInputSchema, qrCodeGeneratorOutputSchema, type QrCodeGeneratorInput } from "@/tools/schema/qr-code-generator";

export async function runQrCodeGenerator(input: QrCodeGeneratorInput) {
  const parsed = qrCodeGeneratorInputSchema.parse(input);
  const svg = await generateQrCodeSvg(parsed);
  return qrCodeGeneratorOutputSchema.parse({ svg, downloadName: "qr-code.svg" });
}

export const toolLogic = runQrCodeGenerator;
