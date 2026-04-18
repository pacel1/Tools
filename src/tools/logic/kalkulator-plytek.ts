import { kalkulatorPlytekInputSchema, kalkulatorPlytekOutputSchema } from '../schema/kalkulator-plytek';

export type KalkulatorPlytekInput = import('zod').infer<typeof kalkulatorPlytekInputSchema>;
export type KalkulatorPlytekOutput = import('zod').infer<typeof kalkulatorPlytekOutputSchema>;

export function run(input: KalkulatorPlytekInput): KalkulatorPlytekOutput {
  const parsed = kalkulatorPlytekInputSchema.parse(input);
  const tileAreaM2 = (parsed.tileWidthCm * parsed.tileHeightCm) / 10000;
  const areaWithWaste = parsed.area * (1 + parsed.wastePercent / 100);
  const tiles = Math.ceil(areaWithWaste / tileAreaM2);
  const boxes = Math.ceil(tiles / parsed.tilesPerBox);

  return kalkulatorPlytekOutputSchema.parse({
    tiles,
    boxes,
    areaWithWaste: Number(areaWithWaste.toFixed(4)),
  });
}

export const toolLogic = run;
