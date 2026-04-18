import { describe, expect, it } from 'vitest';
import { kalkulatorFugiInputSchema } from '../schema/kalkulator-fugi';
import { run, toolLogic } from '../logic/kalkulator-fugi';

describe('kalkulator fugi', () => {
  it('exports toolLogic alias', () => {
    expect(toolLogic).toBe(run);
  });

  it('calculates planning estimate', () => {
    const input = kalkulatorFugiInputSchema.parse({
      area: 10,
      tileWidthCm: 30,
      tileHeightCm: 60,
      jointWidthMm: 3,
      jointDepthMm: 8,
      groutDensity: 1.8,
      wastePercent: 10,
      bagWeight: 5
    });

    const result = run(input);

    expect(result.kgBase).toBeGreaterThan(0);
    expect(result.kgTotal).toBeGreaterThan(result.kgBase);
    expect(result.bags).toBeGreaterThanOrEqual(1);
  });
});
