import { z } from 'zod';

export const kalkulatorPlytekInputSchema = z.object({
  area: z.number().finite().positive(),
  tileWidthCm: z.number().finite().positive(),
  tileHeightCm: z.number().finite().positive(),
  wastePercent: z.number().finite().min(0),
  tilesPerBox: z.number().finite().int().positive(),
});

export const kalkulatorPlytekOutputSchema = z.object({
  tiles: z.number().finite().int().min(0),
  boxes: z.number().finite().int().min(0),
  areaWithWaste: z.number().finite().nonnegative(),
});

export const toolInputSchema = kalkulatorPlytekInputSchema;
export const toolOutputSchema = kalkulatorPlytekOutputSchema;
