import {
  kalkulatorHydroizolacjiInputSchema,
  kalkulatorHydroizolacjiOutputSchema,
  type KalkulatorHydroizolacjiInput,
  type KalkulatorHydroizolacjiOutput,
} from "../schema/kalkulator-hydroizolacji";

function round(value: number, digits = 2) {
  return Number(value.toFixed(digits));
}

export function runKalkulatorHydroizolacji(
  input: KalkulatorHydroizolacjiInput,
): KalkulatorHydroizolacjiOutput {
  const parsed = kalkulatorHydroizolacjiInputSchema.parse(input);
  const quantityBase = (parsed.area * parsed.coats) / parsed.coverage;
  const quantityTotal = quantityBase * (1 + parsed.wastePercent / 100);
  const packs = Math.ceil(quantityTotal / parsed.packSize);
  const tapeLength = parsed.tapeMeters * (1 + parsed.wastePercent / 100);

  return kalkulatorHydroizolacjiOutputSchema.parse({
    quantityBase: round(quantityBase),
    quantityTotal: round(quantityTotal),
    packs,
    tapeLength: round(tapeLength),
  });
}

export const toolLogic = runKalkulatorHydroizolacji;
