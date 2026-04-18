import { z } from "zod";

export const kalkulatorRynienInputSchema = z.object({
  roofType: z.enum(["gable", "hip", "shed"]),
  buildingLength: z.number().finite().positive(),
  buildingWidth: z.number().finite().positive(),
  downspoutSpacing: z.number().finite().positive(),
  hangerSpacingCm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
});

export const kalkulatorRynienOutputSchema = z.object({
  gutterMeters: z.number().finite().nonnegative(),
  sections3m: z.number().int().nonnegative(),
  hangers: z.number().int().nonnegative(),
  downspouts: z.number().int().nonnegative(),
  corners: z.number().int().nonnegative(),
});

export const toolInputSchema = kalkulatorRynienInputSchema;
export const toolOutputSchema = kalkulatorRynienOutputSchema;

export type KalkulatorRynienInput = z.infer<typeof kalkulatorRynienInputSchema>;
export type KalkulatorRynienOutput = z.infer<typeof kalkulatorRynienOutputSchema>;
