import { z } from "zod";

export const kalkulatorDachuInputSchema = z.object({
  roofType: z.enum(["gable", "shed"]),
  materialType: z.enum(["tile", "metal", "shingle"]),
  buildingLength: z.number().finite().positive(),
  buildingWidth: z.number().finite().positive(),
  pitchDegrees: z.number().finite().gt(0).lt(80),
  eaveCm: z.number().finite().min(0),
  wastePercent: z.number().finite().min(0),
  coveragePerPack: z.number().finite().positive(),
});

export const kalkulatorDachuOutputSchema = z.object({
  slopeLength: z.number().finite().nonnegative(),
  roofArea: z.number().finite().nonnegative(),
  roofAreaWithWaste: z.number().finite().nonnegative(),
  packs: z.number().int().nonnegative(),
  membraneArea: z.number().finite().nonnegative(),
  ridgeLength: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorDachuInputSchema;
export const toolOutputSchema = kalkulatorDachuOutputSchema;

export type KalkulatorDachuInput = z.infer<typeof kalkulatorDachuInputSchema>;
export type KalkulatorDachuOutput = z.infer<typeof kalkulatorDachuOutputSchema>;
