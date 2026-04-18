import { describe, expect, it } from 'vitest';
import { run } from '../logic/kalkulator-plyt-gk';

describe('kalkulator plyt GK', () => {
  it('calculates boards, screws and profiles', () => {
    const result = run({
      area: 10,
      boardWidthCm: 120,
      boardHeightCm: 200,
      wastePercent: 10,
      screwsPerBoard: 25,
      profilesPerSqm: 3.5
    });

    expect(result.boards).toBe(5);
    expect(result.screws).toBe(125);
    expect(result.profilesMeters).toBe(35);
  });

  it('rounds up board count with waste', () => {
    const result = run({
      area: 12,
      boardWidthCm: 125,
      boardHeightCm: 250,
      wastePercent: 15,
      screwsPerBoard: 20,
      profilesPerSqm: 2,
    });

    expect(result.boards).toBe(5);
    expect(result.screws).toBe(100);
    expect(result.profilesMeters).toBe(24);
  });
});
