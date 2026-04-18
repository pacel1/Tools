import { describe, expect, it } from "vitest";
import { runKalkulatorFundamentow } from "../logic/kalkulator-fundamentow";

describe("runKalkulatorFundamentow", () => {
  it("calculates a strip footing", () => {
    const result = runKalkulatorFundamentow({
      projectType: "strip-footing",
      length: 20,
      width: 0.4,
      heightCm: 40,
      count: 1,
      wastePercent: 8,
      bagYield: 0.025,
    });

    expect(result).toEqual({
      unitVolume: 3.2,
      totalVolume: 3.2,
      volumeWithWaste: 3.456,
      bags: 139,
      waterproofArea: 16,
    });
  });

  it("calculates multiple pad footings", () => {
    const result = runKalkulatorFundamentow({
      projectType: "pad-footing",
      length: 0.8,
      width: 0.8,
      heightCm: 40,
      count: 6,
      wastePercent: 5,
      bagYield: 0.025,
    });

    expect(result.totalVolume).toBeCloseTo(1.536, 3);
    expect(result.waterproofArea).toBeCloseTo(7.68, 2);
    expect(result.bags).toBe(65);
  });

  it("rejects zero dimensions", () => {
    expect(() =>
      runKalkulatorFundamentow({
        projectType: "slab",
        length: 0,
        width: 8,
        heightCm: 20,
        count: 1,
        wastePercent: 5,
        bagYield: 0.025,
      }),
    ).toThrow();
  });
});
