import { z } from "zod";

export const kalkulatorTynkuInputSchema = z.object({
  area: z.number().finite().positive(),
  consumptionPerMm: z.number().finite().positive(),
  layerMm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0).max(100),
  bagWeight: z.number().finite().positive(),
});

export const kalkulatorTynkuOutputSchema = z.object({
  kgBase: z.number().finite().nonnegative(),
  kgTotal: z.number().finite().nonnegative(),
  bags: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorTynkuInputSchema;
export const toolOutputSchema = kalkulatorTynkuOutputSchema;
