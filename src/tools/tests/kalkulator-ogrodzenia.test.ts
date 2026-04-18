import { describe, expect, it } from 'vitest';
import { kalkulatorOgrodzeniaInputSchema, kalkulatorOgrodzeniaOutputSchema } from '../schema/kalkulator-ogrodzenia';
import { runKalkulatorOgrodzenia, toolLogic } from '../logic/kalkulator-ogrodzenia';

describe('kalkulator ogrodzenia', () => {
  it('calculates panels and posts', () => {
    const result = runKalkulatorOgrodzenia({
      lengthMeters: 20,
      panelWidthMeters: 2.5,
      gateWidthMeters: 4,
      wicketWidthMeters: 1,
      wastePercent: 5
    });

    expect(result).toEqual({
      panels: 7,
      posts: 8,
      fillableLength: 15.75
    });
  });

  it('exposes toolLogic alias', () => {
    expect(toolLogic).toBe(runKalkulatorOgrodzenia);
  });

  it('validates schemas', () => {
    expect(() =>
      kalkulatorOgrodzeniaInputSchema.parse({
        lengthMeters: 10,
        panelWidthMeters: 2,
        gateWidthMeters: 0,
        wicketWidthMeters: 0,
        wastePercent: 0
      })
    ).not.toThrow();

    expect(() =>
      kalkulatorOgrodzeniaOutputSchema.parse({
        panels: 1,
        posts: 2,
        fillableLength: 1.5
      })
    ).not.toThrow();
  });
});
