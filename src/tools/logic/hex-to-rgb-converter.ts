import { createColorSnapshot } from "@/lib/color-tools/core";
import {
  hexToRgbConverterInputSchema,
  hexToRgbConverterOutputSchema,
  type HexToRgbConverterInput,
  type HexToRgbConverterOutput
} from "@/tools/schema/hex-to-rgb-converter";

export function runHexToRgbConverter(
  input: HexToRgbConverterInput
): HexToRgbConverterOutput {
  const parsed = hexToRgbConverterInputSchema.parse(input);
  const color = createColorSnapshot(parsed.hex);

  return hexToRgbConverterOutputSchema.parse({
    normalizedHex: color.hex,
    red: color.red,
    green: color.green,
    blue: color.blue,
    rgb: color.rgb
  });
}

export const toolLogic = runHexToRgbConverter;
