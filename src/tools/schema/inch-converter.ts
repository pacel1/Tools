import { z } from "zod";

const inchUnitSchema = z.enum(["IN", "CM", "MM", "FT"]);

export const inchConverterInputSchema = z.object({
  value: z.coerce.number().finite(),
  fromUnit: inchUnitSchema,
  toUnit: inchUnitSchema
});

export const inchConverterOutputSchema = z.object({
  result: z.number(),
  formatted: z.string(),
  fromUnit: inchUnitSchema,
  toUnit: inchUnitSchema
});

export const toolInputSchema = inchConverterInputSchema;
export const toolOutputSchema = inchConverterOutputSchema;

export type InchConverterInput = z.infer<typeof inchConverterInputSchema>;
export type InchConverterOutput = z.infer<typeof inchConverterOutputSchema>;
