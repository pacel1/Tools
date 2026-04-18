import { kalkulatorPaneliPodlogowychInputSchema, kalkulatorPaneliPodlogowychOutputSchema } from "../schema/kalkulator-paneli-podlogowych";

export type KalkulatorPaneliPodlogowychInput = {
  area: number;
  panelWidthCm: number;
  panelLengthCm: number;
  wastePercent: number;
  packCoverage: number;
};

export type KalkulatorPaneliPodlogowychOutput = {
  panels: number;
  packs: number;
  areaWithWaste: number;
};

export function runKalkulatorPaneliPodlogowych(
  input: KalkulatorPaneliPodlogowychInput,
): KalkulatorPaneliPodlogowychOutput {
  const parsed = kalkulatorPaneliPodlogowychInputSchema.parse(input);

  const panelAreaM2 = (parsed.panelWidthCm * parsed.panelLengthCm) / 10000;
  const areaWithWaste = parsed.area * (1 + parsed.wastePercent / 100);
  const panels = Math.ceil(areaWithWaste / panelAreaM2);
  const packs = Math.ceil(areaWithWaste / parsed.packCoverage);

  return kalkulatorPaneliPodlogowychOutputSchema.parse({
    panels,
    packs,
    areaWithWaste: Number(areaWithWaste.toFixed(4)),
  });
}

export const toolLogic = runKalkulatorPaneliPodlogowych;
