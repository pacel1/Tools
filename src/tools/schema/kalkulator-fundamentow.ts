import { z } from "zod";

export const kalkulatorFundamentowInputSchema = z.object({
  projectType: z.enum(["strip-footing", "slab", "pad-footing"]),
  length: z.number().finite().positive(),
  width: z.number().finite().positive(),
  heightCm: z.number().finite().positive(),
  count: z.number().int().positive(),
  wastePercent: z.number().finite().min(0),
  bagYield: z.number().finite().positive(),
});

export const kalkulatorFundamentowOutputSchema = z.object({
  unitVolume: z.number().finite().nonnegative(),
  totalVolume: z.number().finite().nonnegative(),
  volumeWithWaste: z.number().finite().nonnegative(),
  bags: z.number().int().nonnegative(),
  waterproofArea: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorFundamentowInputSchema;
export const toolOutputSchema = kalkulatorFundamentowOutputSchema;

export type KalkulatorFundamentowInput = z.infer<typeof kalkulatorFundamentowInputSchema>;
export type KalkulatorFundamentowOutput = z.infer<typeof kalkulatorFundamentowOutputSchema>;
