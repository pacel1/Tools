import { litersToGallonsConverterInputSchema, litersToGallonsConverterOutputSchema, type LitersToGallonsConverterInput, type LitersToGallonsConverterOutput } from "@/tools/schema/liters-to-gallons-converter";

export function runLitersToGallonsConverter(input: LitersToGallonsConverterInput): LitersToGallonsConverterOutput {
  const parsed = litersToGallonsConverterInputSchema.parse(input);
  const result = parsed.value * 0.2641720524;
  return litersToGallonsConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runLitersToGallonsConverter;
