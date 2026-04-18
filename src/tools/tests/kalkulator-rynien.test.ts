import { describe, expect, it } from "vitest";
import { runKalkulatorRynien } from "../logic/kalkulator-rynien";

describe("runKalkulatorRynien", () => {
  it("calculates a gable roof gutter set", () => {
    const result = runKalkulatorRynien({
      roofType: "gable",
      buildingLength: 10,
      buildingWidth: 8,
      downspoutSpacing: 10,
      hangerSpacingCm: 50,
      wastePercent: 5,
    });

    expect(result).toEqual({
      gutterMeters: 21,
      sections3m: 7,
      hangers: 43,
      downspouts: 3,
      corners: 4,
    });
  });

  it("calculates a shed roof with one drainage side", () => {
    const result = runKalkulatorRynien({
      roofType: "shed",
      buildingLength: 12,
      buildingWidth: 7,
      downspoutSpacing: 12,
      hangerSpacingCm: 60,
      wastePercent: 0,
    });

    expect(result.gutterMeters).toBe(12);
    expect(result.sections3m).toBe(4);
    expect(result.downspouts).toBe(1);
    expect(result.corners).toBe(0);
  });

  it("rejects invalid hanger spacing", () => {
    expect(() =>
      runKalkulatorRynien({
        roofType: "hip",
        buildingLength: 10,
        buildingWidth: 8,
        downspoutSpacing: 10,
        hangerSpacingCm: 0,
        wastePercent: 5,
      }),
    ).toThrow();
  });
});
