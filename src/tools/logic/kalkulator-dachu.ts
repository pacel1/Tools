import {
  kalkulatorDachuInputSchema,
  kalkulatorDachuOutputSchema,
  type KalkulatorDachuInput,
  type KalkulatorDachuOutput,
} from "../schema/kalkulator-dachu";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export function runKalkulatorDachu(input: KalkulatorDachuInput): KalkulatorDachuOutput {
  const parsed = kalkulatorDachuInputSchema.parse(input);
  const pitchRadians = (parsed.pitchDegrees * Math.PI) / 180;
  const eaveM = parsed.eaveCm / 100;

  let slopeLength = 0;
  let roofArea = 0;
  let ridgeLength = 0;

  if (parsed.roofType === "gable") {
    const halfSpan = parsed.buildingWidth / 2 + eaveM;
    slopeLength = halfSpan / Math.cos(pitchRadians);
    roofArea = 2 * parsed.buildingLength * slopeLength;
    ridgeLength = parsed.buildingLength;
  } else {
    const fullSpan = parsed.buildingWidth + eaveM * 2;
    slopeLength = fullSpan / Math.cos(pitchRadians);
    roofArea = parsed.buildingLength * slopeLength;
    ridgeLength = 0;
  }

  const roofAreaWithWaste = roofArea * (1 + parsed.wastePercent / 100);
  const packs = Math.ceil(roofAreaWithWaste / parsed.coveragePerPack);

  return kalkulatorDachuOutputSchema.parse({
    slopeLength: round(slopeLength),
    roofArea: round(roofArea),
    roofAreaWithWaste: round(roofAreaWithWaste),
    packs,
    membraneArea: round(roofAreaWithWaste),
    ridgeLength: round(ridgeLength),
  });
}

export const toolLogic = runKalkulatorDachu;
