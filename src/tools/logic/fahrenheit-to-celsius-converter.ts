import { fahrenheitToCelsiusConverterInputSchema, fahrenheitToCelsiusConverterOutputSchema, type FahrenheitToCelsiusConverterInput, type FahrenheitToCelsiusConverterOutput } from "@/tools/schema/fahrenheit-to-celsius-converter";

export function runFahrenheitToCelsiusConverter(input: FahrenheitToCelsiusConverterInput): FahrenheitToCelsiusConverterOutput {
  const parsed = fahrenheitToCelsiusConverterInputSchema.parse(input);
  const result = (parsed.value - 32) * (5 / 9);
  return fahrenheitToCelsiusConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runFahrenheitToCelsiusConverter;
