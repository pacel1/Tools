import { z } from "zod";

export const kalkulatorHydroizolacjiInputSchema = z.object({
  surfaceType: z.enum(["bathroom", "balcony", "terrace", "foundation"]),
  area: z.number().finite().positive(),
  coats: z.number().int().positive(),
  coverage: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  packSize: z.number().finite().positive(),
  tapeMeters: z.number().finite().min(0),
});

export const kalkulatorHydroizolacjiOutputSchema = z.object({
  quantityBase: z.number().finite().nonnegative(),
  quantityTotal: z.number().finite().nonnegative(),
  packs: z.number().int().nonnegative(),
  tapeLength: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorHydroizolacjiInputSchema;
export const toolOutputSchema = kalkulatorHydroizolacjiOutputSchema;

export type KalkulatorHydroizolacjiInput = z.infer<typeof kalkulatorHydroizolacjiInputSchema>;
export type KalkulatorHydroizolacjiOutput = z.infer<typeof kalkulatorHydroizolacjiOutputSchema>;
