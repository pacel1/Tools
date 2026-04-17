import { createColorSnapshot } from "@/lib/color-tools/core";
import {
  colorPickerInputSchema,
  colorPickerOutputSchema,
  type ColorPickerInput,
  type ColorPickerOutput
} from "@/tools/schema/color-picker";

export function runColorPicker(input: ColorPickerInput): ColorPickerOutput {
  const parsed = colorPickerInputSchema.parse(input);
  const color = createColorSnapshot(parsed.hex);

  return colorPickerOutputSchema.parse({
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl
  });
}

export const toolLogic = runColorPicker;
