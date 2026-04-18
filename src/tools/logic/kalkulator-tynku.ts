import { kalkulatorTynkuInputSchema, kalkulatorTynkuOutputSchema } from "../schema/kalkulator-tynku";

export type KalkulatorTynkuInput = z.infer<typeof kalkulatorTynkuInputSchema>;
export type KalkulatorTynkuOutput = z.infer<typeof kalkulatorTynkuOutputSchema>;

import type { z } from "zod";

export function runKalkulatorTynku(input: KalkulatorTynkuInput): KalkulatorTynkuOutput {
  const parsed = kalkulatorTynkuInputSchema.parse(input);

  const kgBase = parsed.area * parsed.consumptionPerMm * parsed.layerMm;
  const kgTotal = kgBase * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(Number(kgTotal.toFixed(6)) / parsed.bagWeight);

  return kalkulatorTynkuOutputSchema.parse({
    kgBase: Number(kgBase.toFixed(3)),
    kgTotal: Number(kgTotal.toFixed(3)),
    bags,
  });
}

export const toolLogic = runKalkulatorTynku;
