import { kalkulatorWelnyMineralnejInputSchema, kalkulatorWelnyMineralnejOutputSchema, type KalkulatorWelnyMineralnejInput, type KalkulatorWelnyMineralnejOutput } from "../schema/kalkulator-welny-mineralnej";

export function run(input: KalkulatorWelnyMineralnejInput): KalkulatorWelnyMineralnejOutput {
  const parsed = kalkulatorWelnyMineralnejInputSchema.parse(input);
  const wasteMultiplier = 1 + parsed.wastePercent / 100;
  const areaWithWaste = parsed.area * wasteMultiplier;
  const thicknessM = parsed.thicknessCm / 100;
  const volume = areaWithWaste * thicknessM;
  const packages = Math.ceil(Number(areaWithWaste.toFixed(6)) / parsed.packageCoverage);

  return kalkulatorWelnyMineralnejOutputSchema.parse({
    volume: Number(volume.toFixed(4)),
    packages,
    areaWithWaste: Number(areaWithWaste.toFixed(2)),
  });
}

export const toolLogic = run;
