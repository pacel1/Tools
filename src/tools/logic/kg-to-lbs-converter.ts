import { kgToLbsInputSchema, kgToLbsOutputSchema } from "@/tools/schema/kg-to-lbs-converter";

export function convertKgToLbs(input: unknown) {
  const parsed = kgToLbsInputSchema.parse(input);
  const pounds = parsed.kilograms * 2.2046226218;

  return kgToLbsOutputSchema.parse({
    pounds,
    formatted: `${pounds.toFixed(2)} lb`
  });
}

export const toolLogic = convertKgToLbs;
