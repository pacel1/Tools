import { kalkulatorGladziInputSchema, kalkulatorGladziOutputSchema, type KalkulatorGladziInput, type KalkulatorGladziOutput } from "../schema/kalkulator-gladzi";

export function run(input: KalkulatorGladziInput): KalkulatorGladziOutput {
  const parsed = kalkulatorGladziInputSchema.parse(input);

  const kgBase = parsed.area * parsed.consumptionPerMm * parsed.layerMm;
  const kgTotal = kgBase * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(Number(kgTotal.toFixed(6)) / parsed.bagWeight);

  return kalkulatorGladziOutputSchema.parse({
    kgBase: Number(kgBase.toFixed(3)),
    kgTotal: Number(kgTotal.toFixed(3)),
    bags,
  });
}

export const toolLogic = run;
