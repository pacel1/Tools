import { describe, expect, it } from "vitest";
import { run } from "../logic/kalkulator-gladzi";

describe("kalkulator gladzi", () => {
  it("calculates base, total and bags correctly", () => {
    const result = run({
      area: 100,
      consumptionPerMm: 1,
      layerMm: 2,
      wastePercent: 10,
      bagWeight: 20,
    });

    expect(result).toEqual({
      kgBase: 200,
      kgTotal: 220,
      bags: 11,
    });
  });

  it("rounds up the bag count", () => {
    const result = run({
      area: 12.5,
      consumptionPerMm: 0.8,
      layerMm: 1.5,
      wastePercent: 0,
      bagWeight: 25,
    });

    expect(result.kgBase).toBeCloseTo(15, 3);
    expect(result.kgTotal).toBeCloseTo(15, 3);
    expect(result.bags).toBe(1);
  });
});
