import { kalkulatorStyropianuInputSchema, kalkulatorStyropianuOutputSchema, type KalkulatorStyropianuInput, type KalkulatorStyropianuOutput } from "../schema/kalkulator-styropianu";

export function run(input: KalkulatorStyropianuInput): KalkulatorStyropianuOutput {
  const parsed = kalkulatorStyropianuInputSchema.parse(input);

  const areaWithWaste = parsed.area * (1 + parsed.wastePercent / 100);
  const volume = (parsed.area * parsed.thicknessCm) / 100;
  const packages = Math.ceil(areaWithWaste / parsed.packageCoverage);

  return kalkulatorStyropianuOutputSchema.parse({
    volume,
    packages,
    areaWithWaste,
  });
}

export const toolLogic = run;
