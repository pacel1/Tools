import {
  kalkulatorKostkiBrukowejInputSchema,
  kalkulatorKostkiBrukowejOutputSchema,
} from "../schema/kalkulator-kostki-brukowej";

type Input = z.infer<typeof kalkulatorKostkiBrukowejInputSchema>;

type Output = z.infer<typeof kalkulatorKostkiBrukowejOutputSchema>;

import { z } from "zod";

export function run(input: Input): Output {
  const parsed = kalkulatorKostkiBrukowejInputSchema.parse(input);

  const blockAreaM2 = (parsed.blockWidthCm / 100) * (parsed.blockLengthCm / 100);
  const adjustedArea = parsed.area * (1 + parsed.wastePercent / 100);
  const blocks = Math.ceil(adjustedArea / blockAreaM2);
  const packs = Math.ceil(adjustedArea / parsed.packCoverage);
  const edgingMeters = parsed.area * parsed.edgingPerSqm;

  return kalkulatorKostkiBrukowejOutputSchema.parse({
    blocks,
    packs,
    edgingMeters: Number(edgingMeters.toFixed(2)),
  });
}

export const toolLogic = run;
