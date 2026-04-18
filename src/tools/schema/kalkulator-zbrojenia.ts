import { z } from "zod";

export const kalkulatorZbrojeniaInputSchema = z.object({
  layoutType: z.enum(["two-way", "one-way"]),
  length: z.number().finite().positive(),
  width: z.number().finite().positive(),
  spacingCm: z.number().finite().positive(),
  coverCm: z.number().finite().min(0),
  lapPercent: z.number().finite().min(0),
  barLength: z.number().finite().positive(),
  unitWeight: z.number().finite().positive(),
});

export const kalkulatorZbrojeniaOutputSchema = z.object({
  barsAlongLength: z.number().int().nonnegative(),
  barsAlongWidth: z.number().int().nonnegative(),
  totalLength: z.number().finite().nonnegative(),
  bars: z.number().int().nonnegative(),
  weight: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorZbrojeniaInputSchema;
export const toolOutputSchema = kalkulatorZbrojeniaOutputSchema;

export type KalkulatorZbrojeniaInput = z.infer<typeof kalkulatorZbrojeniaInputSchema>;
export type KalkulatorZbrojeniaOutput = z.infer<typeof kalkulatorZbrojeniaOutputSchema>;
