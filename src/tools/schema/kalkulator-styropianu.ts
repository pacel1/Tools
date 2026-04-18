import { z } from "zod";

export const kalkulatorStyropianuInputSchema = z.object({
  area: z.number().finite().positive(),
  thicknessCm: z.number().finite().positive(),
  packageCoverage: z.number().finite().positive(),
  wastePercent: z.number().finite().nonnegative(),
  packageVolume: z.number().finite().positive(),
});

export const kalkulatorStyropianuOutputSchema = z.object({
  volume: z.number().finite().nonnegative(),
  packages: z.number().finite().positive(),
  areaWithWaste: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorStyropianuInputSchema;
export const toolOutputSchema = kalkulatorStyropianuOutputSchema;

export type KalkulatorStyropianuInput = z.infer<typeof kalkulatorStyropianuInputSchema>;
export type KalkulatorStyropianuOutput = z.infer<typeof kalkulatorStyropianuOutputSchema>;
