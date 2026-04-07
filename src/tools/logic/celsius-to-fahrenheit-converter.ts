import { celsiusToFahrenheitConverterInputSchema, celsiusToFahrenheitConverterOutputSchema, type CelsiusToFahrenheitConverterInput, type CelsiusToFahrenheitConverterOutput } from "@/tools/schema/celsius-to-fahrenheit-converter";

export function runCelsiusToFahrenheitConverter(input: CelsiusToFahrenheitConverterInput): CelsiusToFahrenheitConverterOutput {
  const parsed = celsiusToFahrenheitConverterInputSchema.parse(input);
  const result = parsed.value * (9 / 5) + 32;
  return celsiusToFahrenheitConverterOutputSchema.parse({ result, formatted: result.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") });
}

export const toolLogic = runCelsiusToFahrenheitConverter;
