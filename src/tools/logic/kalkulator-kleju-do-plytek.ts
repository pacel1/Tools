import {
  kalkulatorKlejuDoPlytekInputSchema,
  kalkulatorKlejuDoPlytekOutputSchema,
} from "../schema/kalkulator-kleju-do-plytek";
import type { z } from "zod";

export type KalkulatorKlejuDoPlytekInput = z.infer<typeof kalkulatorKlejuDoPlytekInputSchema>;
export type KalkulatorKlejuDoPlytekOutput = z.infer<typeof kalkulatorKlejuDoPlytekOutputSchema>;

export function run(input: KalkulatorKlejuDoPlytekInput): KalkulatorKlejuDoPlytekOutput {
  const parsed = kalkulatorKlejuDoPlytekInputSchema.parse(input);

  const kgBase = parsed.area * parsed.consumptionPerMm * parsed.layerMm;
  const kgTotal = kgBase * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(kgTotal / parsed.bagWeight);

  return kalkulatorKlejuDoPlytekOutputSchema.parse({
    kgBase: Number(kgBase.toFixed(3)),
    kgTotal: Number(kgTotal.toFixed(3)),
    bags,
  });
}

export const toolLogic = run;
