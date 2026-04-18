import {
  kalkulatorZbrojeniaInputSchema,
  kalkulatorZbrojeniaOutputSchema,
  type KalkulatorZbrojeniaInput,
  type KalkulatorZbrojeniaOutput,
} from "../schema/kalkulator-zbrojenia";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export function runKalkulatorZbrojenia(
  input: KalkulatorZbrojeniaInput,
): KalkulatorZbrojeniaOutput {
  const parsed = kalkulatorZbrojeniaInputSchema.parse(input);
  const spacingM = parsed.spacingCm / 100;
  const coverM = parsed.coverCm / 100;
  const usableLength = Math.max(parsed.length - coverM * 2, 0);
  const usableWidth = Math.max(parsed.width - coverM * 2, 0);
  const lapFactor = 1 + parsed.lapPercent / 100;

  const barsAlongLength = Math.floor(usableWidth / spacingM) + 1;
  const barsAlongWidth =
    parsed.layoutType === "two-way" ? Math.floor(usableLength / spacingM) + 1 : 0;

  const totalLength =
    barsAlongLength * usableLength * lapFactor +
    barsAlongWidth * usableWidth * lapFactor;
  const bars = Math.ceil(totalLength / parsed.barLength);
  const weight = totalLength * parsed.unitWeight;

  return kalkulatorZbrojeniaOutputSchema.parse({
    barsAlongLength,
    barsAlongWidth,
    totalLength: round(totalLength),
    bars,
    weight: round(weight),
  });
}

export const toolLogic = runKalkulatorZbrojenia;
