import { z } from "zod";

export const kalkulatorGladziInputSchema = z.object({
  area: z.number().finite().positive(),
  consumptionPerMm: z.number().finite().positive(),
  layerMm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0).max(100),
  bagWeight: z.number().finite().positive(),
});

export const kalkulatorGladziOutputSchema = z.object({
  kgBase: z.number().finite().nonnegative(),
  kgTotal: z.number().finite().nonnegative(),
  bags: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorGladziInputSchema;
export const toolOutputSchema = kalkulatorGladziOutputSchema;

export type KalkulatorGladziInput = z.infer<typeof kalkulatorGladziInputSchema>;
export type KalkulatorGladziOutput = z.infer<typeof kalkulatorGladziOutputSchema>;
