import { gallonsToLitersConverterInputSchema, gallonsToLitersConverterOutputSchema, type GallonsToLitersConverterInput, type GallonsToLitersConverterOutput } from "@/tools/schema/gallons-to-liters-converter";

export function runGallonsToLitersConverter(input: GallonsToLitersConverterInput): GallonsToLitersConverterOutput {
  const parsed = gallonsToLitersConverterInputSchema.parse(input);
  const result = parsed.value * 3.785411784;
  return gallonsToLitersConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runGallonsToLitersConverter;
