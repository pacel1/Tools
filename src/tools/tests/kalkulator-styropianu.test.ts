import { describe, expect, it } from "vitest";
import { run } from "../logic/kalkulator-styropianu";

describe("kalkulator styropianu", () => {
  it("calculates volume, packages and waste-adjusted area", () => {
    const result = run({
      area: 100,
      thicknessCm: 15,
      packageCoverage: 3,
      wastePercent: 10,
      packageVolume: 0.3,
    });

    expect(result.volume).toBeCloseTo(15);
    expect(result.areaWithWaste).toBeCloseTo(110);
    expect(result.packages).toBe(37);
  });

  it("rounds package count up", () => {
    const result = run({
      area: 10,
      thicknessCm: 10,
      packageCoverage: 4,
      wastePercent: 0,
      packageVolume: 0.25,
    });

    expect(result.packages).toBe(3);
  });
});
