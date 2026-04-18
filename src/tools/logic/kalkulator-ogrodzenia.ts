import { kalkulatorOgrodzeniaInputSchema, kalkulatorOgrodzeniaOutputSchema, type KalkulatorOgrodzeniaInput, type KalkulatorOgrodzeniaOutput } from '../schema/kalkulator-ogrodzenia';

export function runKalkulatorOgrodzenia(input: KalkulatorOgrodzeniaInput): KalkulatorOgrodzeniaOutput {
  const parsed = kalkulatorOgrodzeniaInputSchema.parse(input);
  const openings = parsed.gateWidthMeters + parsed.wicketWidthMeters;
  const baseFillableLength = Math.max(0, parsed.lengthMeters - openings);
  const fillableLength = baseFillableLength * (1 + parsed.wastePercent / 100);
  const panels = Math.ceil(fillableLength / parsed.panelWidthMeters);
  const posts = panels > 0 ? panels + 1 : 0;

  return kalkulatorOgrodzeniaOutputSchema.parse({
    panels,
    posts,
    fillableLength: Number(fillableLength.toFixed(3))
  });
}

export const toolLogic = runKalkulatorOgrodzenia;
