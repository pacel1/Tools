import {
  storageConverterInputSchema,
  storageConverterOutputSchema,
  type StorageConverterInput,
  type StorageConverterOutput
} from "@/tools/schema/storage-converter";

const factors = {
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4
} as const;

function formatResult(value: number) {
  const decimals = value >= 100 ? 2 : value >= 1 ? 4 : 6;
  return value.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
}

export function runStorageConverter(input: StorageConverterInput): StorageConverterOutput {
  const parsed = storageConverterInputSchema.parse(input);
  const result = (parsed.value * factors[parsed.fromUnit]) / factors[parsed.toUnit];

  return storageConverterOutputSchema.parse({
    result,
    formatted: formatResult(result),
    fromUnit: parsed.fromUnit,
    toUnit: parsed.toUnit
  });
}

export const toolLogic = runStorageConverter;
