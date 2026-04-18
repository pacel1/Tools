import { z } from 'zod';

export const kalkulatorOgrodzeniaInputSchema = z.object({
  lengthMeters: z.number().finite().nonnegative(),
  panelWidthMeters: z.number().finite().positive(),
  gateWidthMeters: z.number().finite().nonnegative(),
  wicketWidthMeters: z.number().finite().nonnegative(),
  wastePercent: z.number().finite().min(0).max(100)
});

export const kalkulatorOgrodzeniaOutputSchema = z.object({
  panels: z.number().int().nonnegative(),
  posts: z.number().int().nonnegative(),
  fillableLength: z.number().finite().nonnegative()
});

export const toolInputSchema = kalkulatorOgrodzeniaInputSchema;
export const toolOutputSchema = kalkulatorOgrodzeniaOutputSchema;

export type KalkulatorOgrodzeniaInput = z.infer<typeof kalkulatorOgrodzeniaInputSchema>;
export type KalkulatorOgrodzeniaOutput = z.infer<typeof kalkulatorOgrodzeniaOutputSchema>;
