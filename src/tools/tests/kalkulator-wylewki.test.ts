import { describe, expect, it } from "vitest";
import { runKalkulatorWylewki } from "../logic/kalkulator-wylewki";

describe("runKalkulatorWylewki", () => {
  it("calculates a cement screed", () => {
    const result = runKalkulatorWylewki({
      materialType: "cement",
      area: 50,
      thicknessMm: 60,
      densityKgPerM3: 2000,
      wastePercent: 8,
      bagWeight: 25,
    });

    expect(result).toEqual({
      volume: 3,
      kgBase: 6000,
      kgTotal: 6480,
      bags: 260,
      dryTimeDays: 21,
    });
  });

  it("calculates a self-leveling compound with thin layer", () => {
    const result = runKalkulatorWylewki({
      materialType: "self-leveling",
      area: 12,
      thicknessMm: 8,
      densityKgPerM3: 1700,
      wastePercent: 5,
      bagWeight: 20,
    });

    expect(result.volume).toBeCloseTo(0.096, 3);
    expect(result.kgTotal).toBeCloseTo(171.36, 2);
    expect(result.bags).toBe(9);
    expect(result.dryTimeDays).toBe(1);
  });

  it("rejects invalid density", () => {
    expect(() =>
      runKalkulatorWylewki({
        materialType: "anhydrite",
        area: 20,
        thicknessMm: 45,
        densityKgPerM3: 0,
        wastePercent: 5,
        bagWeight: 30,
      }),
    ).toThrow();
  });
});
