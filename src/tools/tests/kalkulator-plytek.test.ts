import { describe, expect, it } from 'vitest';
import { run } from '../logic/kalkulator-plytek';

describe('kalkulator plytek', () => {
  it('calculates tiles, boxes and area with waste', () => {
    const result = run({
      area: 10,
      tileWidthCm: 30,
      tileHeightCm: 30,
      wastePercent: 10,
      tilesPerBox: 10,
    });

    expect(result.areaWithWaste).toBe(11);
    expect(result.tiles).toBe(123);
    expect(result.boxes).toBe(13);
  });

  it('rounds up whole tiles and boxes', () => {
    const result = run({
      area: 1,
      tileWidthCm: 50,
      tileHeightCm: 50,
      wastePercent: 0,
      tilesPerBox: 4,
    });

    expect(result.tiles).toBe(4);
    expect(result.boxes).toBe(1);
  });
});
