import { z } from 'zod';

export const kalkulatorFarbyInputSchema = z.object({
  area: z.number().finite().positive(),
  coverage: z.number().finite().positive(),
  coats: z.number().finite().int().positive(),
  wastePercent: z.number().finite().nonnegative(),
  canSize: z.number().finite().positive(),
});

export const kalkulatorFarbyOutputSchema = z.object({
  litersBase: z.number().finite().nonnegative(),
  litersTotal: z.number().finite().nonnegative(),
  cans: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorFarbyInputSchema;
export const toolOutputSchema = kalkulatorFarbyOutputSchema;

export type KalkulatorFarbyInput = z.infer<typeof kalkulatorFarbyInputSchema>;
export type KalkulatorFarbyOutput = z.infer<typeof kalkulatorFarbyOutputSchema>;
