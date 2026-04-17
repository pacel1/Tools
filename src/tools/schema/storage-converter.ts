import { z } from "zod";

const storageUnitSchema = z.enum(["KB", "MB", "GB", "TB"]);

export const storageConverterInputSchema = z.object({
  value: z.coerce.number().finite().min(0),
  fromUnit: storageUnitSchema,
  toUnit: storageUnitSchema
});

export const storageConverterOutputSchema = z.object({
  result: z.number(),
  formatted: z.string(),
  fromUnit: storageUnitSchema,
  toUnit: storageUnitSchema
});

export const toolInputSchema = storageConverterInputSchema;
export const toolOutputSchema = storageConverterOutputSchema;

export type StorageConverterInput = z.infer<typeof storageConverterInputSchema>;
export type StorageConverterOutput = z.infer<typeof storageConverterOutputSchema>;
