import { generatePalette, normalizeHex } from "@/lib/color-tools/core";
import {
  paletteGeneratorInputSchema,
  paletteGeneratorOutputSchema,
  type PaletteGeneratorInput,
  type PaletteGeneratorOutput
} from "@/tools/schema/palette-generator";

export function runPaletteGenerator(
  input: PaletteGeneratorInput
): PaletteGeneratorOutput {
  const parsed = paletteGeneratorInputSchema.parse(input);

  return paletteGeneratorOutputSchema.parse({
    palette: generatePalette(parsed.baseColor, parsed.count),
    baseColor: normalizeHex(parsed.baseColor)
  });
}

export const toolLogic = runPaletteGenerator;
