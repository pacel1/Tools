import {
  kalkulatorRynienInputSchema,
  kalkulatorRynienOutputSchema,
  type KalkulatorRynienInput,
  type KalkulatorRynienOutput,
} from "../schema/kalkulator-rynien";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

function getBaseGutterMeters(input: KalkulatorRynienInput) {
  switch (input.roofType) {
    case "gable":
      return input.buildingLength * 2;
    case "hip":
      return (input.buildingLength + input.buildingWidth) * 2;
    case "shed":
      return input.buildingLength;
  }
}

function getMinimumDownspouts(roofType: KalkulatorRynienInput["roofType"]) {
  switch (roofType) {
    case "gable":
      return 2;
    case "hip":
      return 4;
    case "shed":
      return 1;
  }
}

function getCorners(roofType: KalkulatorRynienInput["roofType"]) {
  switch (roofType) {
    case "shed":
      return 0;
    case "gable":
    case "hip":
      return 4;
  }
}

export function runKalkulatorRynien(input: KalkulatorRynienInput): KalkulatorRynienOutput {
  const parsed = kalkulatorRynienInputSchema.parse(input);
  const gutterMeters = getBaseGutterMeters(parsed) * (1 + parsed.wastePercent / 100);
  const sections3m = Math.ceil(gutterMeters / 3);
  const hangers = Math.ceil(gutterMeters / (parsed.hangerSpacingCm / 100)) + 1;
  const downspouts = Math.max(
    getMinimumDownspouts(parsed.roofType),
    Math.ceil(gutterMeters / parsed.downspoutSpacing),
  );

  return kalkulatorRynienOutputSchema.parse({
    gutterMeters: round(gutterMeters),
    sections3m,
    hangers,
    downspouts,
    corners: getCorners(parsed.roofType),
  });
}

export const toolLogic = runKalkulatorRynien;
