import { z } from "zod";

export const kalkulatorWelnyMineralnejInputSchema = z.object({
  area: z.number().finite().positive(),
  thicknessCm: z.number().finite().positive(),
  packageCoverage: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  packageVolume: z.number().finite().positive(),
});

export const kalkulatorWelnyMineralnejOutputSchema = z.object({
  volume: z.number().finite().nonnegative(),
  packages: z.number().finite().nonnegative(),
  areaWithWaste: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorWelnyMineralnejInputSchema;
export const toolOutputSchema = kalkulatorWelnyMineralnejOutputSchema;

export type KalkulatorWelnyMineralnejInput = z.infer<typeof kalkulatorWelnyMineralnejInputSchema>;
export type KalkulatorWelnyMineralnejOutput = z.infer<typeof kalkulatorWelnyMineralnejOutputSchema>;
