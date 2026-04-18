import { describe, expect, it } from "vitest";
import { runKalkulatorBetonu } from "../logic/kalkulator-betonu";

describe("runKalkulatorBetonu", () => {
  it("calculates a slab and rounds ready-mix order", () => {
    const result = runKalkulatorBetonu({
      projectType: "slab",
      length: 4,
      width: 3,
      thicknessCm: 12,
      count: 1,
      wastePercent: 10,
      bagYield: 0.025,
      readyMixStep: 0.25,
    });

    expect(result).toEqual({
      unitVolume: 1.44,
      volume: 1.44,
      volumeWithWaste: 1.584,
      bags: 64,
      readyMixOrder: 1.75,
    });
  });

  it("calculates multiple post holes", () => {
    const result = runKalkulatorBetonu({
      projectType: "post-hole",
      thicknessCm: 80,
      diameterCm: 30,
      count: 6,
      wastePercent: 5,
      bagYield: 0.025,
      readyMixStep: 0.25,
    });

    expect(result.unitVolume).toBeCloseTo(0.057, 3);
    expect(result.volume).toBeCloseTo(0.339, 3);
    expect(result.volumeWithWaste).toBeCloseTo(0.356, 3);
    expect(result.bags).toBe(15);
  });

  it("rejects missing geometry for rectangular projects", () => {
    expect(() =>
      runKalkulatorBetonu({
        projectType: "footing",
        thicknessCm: 30,
        count: 1,
        wastePercent: 10,
        bagYield: 0.025,
        readyMixStep: 0.25,
      }),
    ).toThrow();
  });
});
