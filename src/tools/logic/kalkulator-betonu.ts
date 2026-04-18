import {
  kalkulatorBetonuInputSchema,
  kalkulatorBetonuOutputSchema,
  type KalkulatorBetonuInput,
  type KalkulatorBetonuOutput,
} from "../schema/kalkulator-betonu";

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function runKalkulatorBetonu(input: KalkulatorBetonuInput): KalkulatorBetonuOutput {
  const parsed = kalkulatorBetonuInputSchema.parse(input);
  const heightM = parsed.thicknessCm / 100;

  let unitVolume = 0;

  if (parsed.projectType === "post-hole") {
    const radiusM = (parsed.diameterCm ?? 0) / 200;
    unitVolume = Math.PI * radiusM * radiusM * heightM;
  } else {
    unitVolume = (parsed.length ?? 0) * (parsed.width ?? 0) * heightM;
  }

  const volume = unitVolume * parsed.count;
  const volumeWithWaste = volume * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(volumeWithWaste / parsed.bagYield);
  const readyMixOrder =
    Math.ceil(volumeWithWaste / parsed.readyMixStep) * parsed.readyMixStep;

  return kalkulatorBetonuOutputSchema.parse({
    unitVolume: round(unitVolume),
    volume: round(volume),
    volumeWithWaste: round(volumeWithWaste),
    bags,
    readyMixOrder: round(readyMixOrder, 2),
  });
}

export const toolLogic = runKalkulatorBetonu;
