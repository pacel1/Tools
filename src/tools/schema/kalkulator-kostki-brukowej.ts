import { z } from "zod";

export const kalkulatorKostkiBrukowejInputSchema = z.object({
  area: z.number().finite().positive(),
  blockWidthCm: z.number().finite().positive(),
  blockLengthCm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  packCoverage: z.number().finite().positive(),
  edgingPerSqm: z.number().finite().min(0),
});

export const kalkulatorKostkiBrukowejOutputSchema = z.object({
  blocks: z.number().finite().int().nonnegative(),
  packs: z.number().finite().int().nonnegative(),
  edgingMeters: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorKostkiBrukowejInputSchema;
export const toolOutputSchema = kalkulatorKostkiBrukowejOutputSchema;
