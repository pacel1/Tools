import {
  kalkulatorWylewkiInputSchema,
  kalkulatorWylewkiOutputSchema,
  type KalkulatorWylewkiInput,
  type KalkulatorWylewkiOutput,
} from "../schema/kalkulator-wylewki";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function getDryTimeDays(materialType: KalkulatorWylewkiInput["materialType"], thicknessMm: number) {
  switch (materialType) {
    case "cement":
      return Math.max(21, Math.ceil(thicknessMm / 5));
    case "anhydrite":
      return Math.max(7, Math.ceil(thicknessMm / 10));
    case "self-leveling":
      return Math.max(1, Math.ceil(thicknessMm / 10));
  }
}

export function runKalkulatorWylewki(
  input: KalkulatorWylewkiInput,
): KalkulatorWylewkiOutput {
  const parsed = kalkulatorWylewkiInputSchema.parse(input);
  const volume = parsed.area * (parsed.thicknessMm / 1000);
  const kgBase = volume * parsed.densityKgPerM3;
  const kgTotal = kgBase * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(kgTotal / parsed.bagWeight);

  return kalkulatorWylewkiOutputSchema.parse({
    volume: round(volume, 3),
    kgBase: round(kgBase),
    kgTotal: round(kgTotal),
    bags,
    dryTimeDays: getDryTimeDays(parsed.materialType, parsed.thicknessMm),
  });
}

export const toolLogic = runKalkulatorWylewki;
