import { describe, expect, it } from 'vitest';
import { runKalkulatorFarby } from '../logic/kalkulator-farby';

describe('runKalkulatorFarby', () => {
  it('calculates liters and cans correctly', () => {
    const result = runKalkulatorFarby({
      area: 50,
      coverage: 10,
      coats: 2,
      wastePercent: 10,
      canSize: 2.5,
    });

    expect(result).toEqual({
      litersBase: 10,
      litersTotal: 11,
      cans: 5,
    });
  });

  it('rounds cans up to the next whole can', () => {
    const result = runKalkulatorFarby({
      area: 12,
      coverage: 12,
      coats: 1,
      wastePercent: 0,
      canSize: 5,
    });

    expect(result.litersBase).toBe(1);
    expect(result.litersTotal).toBe(1);
    expect(result.cans).toBe(1);
  });
});
