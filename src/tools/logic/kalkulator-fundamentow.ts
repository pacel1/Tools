import {
  kalkulatorFundamentowInputSchema,
  kalkulatorFundamentowOutputSchema,
  type KalkulatorFundamentowInput,
  type KalkulatorFundamentowOutput,
} from "../schema/kalkulator-fundamentow";

function round(value: number, digits = 3) {
  return Number(value.toFixed(digits));
}

export function runKalkulatorFundamentow(
  input: KalkulatorFundamentowInput,
): KalkulatorFundamentowOutput {
  const parsed = kalkulatorFundamentowInputSchema.parse(input);
  const heightM = parsed.heightCm / 100;

  let unitVolume = 0;
  let waterproofArea = 0;

  switch (parsed.projectType) {
    case "slab": {
      unitVolume = parsed.length * parsed.width * heightM;
      const perimeter = (parsed.length + parsed.width) * 2;
      waterproofArea = perimeter * heightM;
      break;
    }
    case "strip-footing": {
      unitVolume = parsed.length * parsed.width * heightM;
      waterproofArea = parsed.length * 2 * heightM;
      break;
    }
    case "pad-footing": {
      unitVolume = parsed.length * parsed.width * heightM;
      waterproofArea = 2 * (parsed.length + parsed.width) * heightM;
      break;
    }
  }

  const totalVolume = unitVolume * parsed.count;
  const volumeWithWaste = totalVolume * (1 + parsed.wastePercent / 100);
  const bags = Math.ceil(volumeWithWaste / parsed.bagYield);

  return kalkulatorFundamentowOutputSchema.parse({
    unitVolume: round(unitVolume),
    totalVolume: round(totalVolume),
    volumeWithWaste: round(volumeWithWaste),
    bags,
    waterproofArea: round(waterproofArea * parsed.count, 2),
  });
}

export const toolLogic = runKalkulatorFundamentow;
