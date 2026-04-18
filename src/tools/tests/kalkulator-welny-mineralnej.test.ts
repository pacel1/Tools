import { describe, expect, it } from "vitest";
import { run } from "../logic/kalkulator-welny-mineralnej";

describe("kalkulator welny mineralnej", () => {
  it("calculates volume, area with waste, and packages", () => {
    const result = run({
      area: 100,
      thicknessCm: 20,
      packageCoverage: 5,
      wastePercent: 10,
      packageVolume: 0.5,
    });

    expect(result.areaWithWaste).toBe(110);
    expect(result.volume).toBe(22);
    expect(result.packages).toBe(22);
  });

  it("rounds package count up", () => {
    const result = run({
      area: 12,
      thicknessCm: 10,
      packageCoverage: 4,
      wastePercent: 0,
      packageVolume: 0.3,
    });

    expect(result.packages).toBe(3);
  });
});
