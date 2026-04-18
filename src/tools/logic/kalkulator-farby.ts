import { kalkulatorFarbyInputSchema, kalkulatorFarbyOutputSchema, type KalkulatorFarbyInput, type KalkulatorFarbyOutput } from '../schema/kalkulator-farby';

export function runKalkulatorFarby(input: KalkulatorFarbyInput): KalkulatorFarbyOutput {
  const parsed = kalkulatorFarbyInputSchema.parse(input);

  const litersBase = (parsed.area * parsed.coats) / parsed.coverage;
  const litersTotal = litersBase * (1 + parsed.wastePercent / 100);
  const cans = Math.ceil(litersTotal / parsed.canSize);

  return kalkulatorFarbyOutputSchema.parse({
    litersBase: Number(litersBase.toFixed(2)),
    litersTotal: Number(litersTotal.toFixed(2)),
    cans,
  });
}

export const toolLogic = runKalkulatorFarby;
