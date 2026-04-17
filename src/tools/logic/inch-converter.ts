import {
  inchConverterInputSchema,
  inchConverterOutputSchema,
  type InchConverterInput,
  type InchConverterOutput
} from "@/tools/schema/inch-converter";

const inchesPerUnit = {
  IN: 1,
  CM: 1 / 2.54,
  MM: 1 / 25.4,
  FT: 12
} as const;

function formatResult(value: number) {
  return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

export function runInchConverter(input: InchConverterInput): InchConverterOutput {
  const parsed = inchConverterInputSchema.parse(input);
  const result =
    (parsed.value * inchesPerUnit[parsed.fromUnit]) / inchesPerUnit[parsed.toUnit];

  return inchConverterOutputSchema.parse({
    result,
    formatted: formatResult(result),
    fromUnit: parsed.fromUnit,
    toUnit: parsed.toUnit
  });
}

export const toolLogic = runInchConverter;
