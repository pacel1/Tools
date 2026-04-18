import { z } from "zod";

export const kalkulatorKlejuDoPlytekInputSchema = z.object({
  area: z.number().finite().positive(),
  consumptionPerMm: z.number().finite().positive(),
  layerMm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  bagWeight: z.number().finite().positive(),
});

export const kalkulatorKlejuDoPlytekOutputSchema = z.object({
  kgBase: z.number().finite().nonnegative(),
  kgTotal: z.number().finite().nonnegative(),
  bags: z.number().finite().int().nonnegative(),
});

export const toolInputSchema = kalkulatorKlejuDoPlytekInputSchema;
export const toolOutputSchema = kalkulatorKlejuDoPlytekOutputSchema;
