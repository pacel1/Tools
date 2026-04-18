import { z } from "zod";

export const kalkulatorWylewkiInputSchema = z.object({
  materialType: z.enum(["cement", "anhydrite", "self-leveling"]),
  area: z.number().finite().positive(),
  thicknessMm: z.number().finite().positive(),
  densityKgPerM3: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  bagWeight: z.number().finite().positive(),
});

export const kalkulatorWylewkiOutputSchema = z.object({
  volume: z.number().finite().nonnegative(),
  kgBase: z.number().finite().nonnegative(),
  kgTotal: z.number().finite().nonnegative(),
  bags: z.number().int().nonnegative(),
  dryTimeDays: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorWylewkiInputSchema;
export const toolOutputSchema = kalkulatorWylewkiOutputSchema;

export type KalkulatorWylewkiInput = z.infer<typeof kalkulatorWylewkiInputSchema>;
export type KalkulatorWylewkiOutput = z.infer<typeof kalkulatorWylewkiOutputSchema>;
