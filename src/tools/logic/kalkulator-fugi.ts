import { kalkulatorFugiInputSchema, kalkulatorFugiOutputSchema } from '../schema/kalkulator-fugi';
import type { z } from "zod";

export type KalkulatorFugiInput = z.infer<typeof kalkulatorFugiInputSchema>;
export type KalkulatorFugiOutput = z.infer<typeof kalkulatorFugiOutputSchema>;

export function run(input: KalkulatorFugiInput): KalkulatorFugiOutput {
  const parsed = kalkulatorFugiInputSchema.parse(input);

  const areaM2 = parsed.area;
  const tileWidthM = parsed.tileWidthCm / 100;
  const tileHeightM = parsed.tileHeightCm / 100;
  const jointWidthM = parsed.jointWidthMm / 1000;
  const jointDepthM = parsed.jointDepthMm / 1000;
  const density = parsed.groutDensity;
  const wasteMultiplier = 1 + parsed.wastePercent / 100;

  const tileArea = tileWidthM * tileHeightM;
  const tilePerimeter = 2 * (tileWidthM + tileHeightM);

  const planningUsagePerM2 =
    tileArea > 0
      ? ((tilePerimeter * jointWidthM * jointDepthM) / tileArea) * density * 1000 * 1.15
      : 0;

  const kgBase = areaM2 * planningUsagePerM2;
  const kgTotal = kgBase * wasteMultiplier;
  const bags = Math.ceil(kgTotal / parsed.bagWeight);

  return {
    kgBase: Number(kgBase.toFixed(2)),
    kgTotal: Number(kgTotal.toFixed(2)),
    bags
  };
}

export const toolLogic = run;
