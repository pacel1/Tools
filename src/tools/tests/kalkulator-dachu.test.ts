import { describe, expect, it } from "vitest";
import { runKalkulatorDachu } from "../logic/kalkulator-dachu";

describe("runKalkulatorDachu", () => {
  it("calculates a gable roof with eaves", () => {
    const result = runKalkulatorDachu({
      roofType: "gable",
      materialType: "tile",
      buildingLength: 10,
      buildingWidth: 8,
      pitchDegrees: 30,
      eaveCm: 30,
      wastePercent: 10,
      coveragePerPack: 5,
    });

    expect(result.slopeLength).toBeCloseTo(4.97, 2);
    expect(result.roofArea).toBeCloseTo(99.3, 2);
    expect(result.roofAreaWithWaste).toBeCloseTo(109.23, 2);
    expect(result.packs).toBe(22);
    expect(result.ridgeLength).toBe(10);
  });

  it("calculates a shed roof", () => {
    const result = runKalkulatorDachu({
      roofType: "shed",
      materialType: "metal",
      buildingLength: 12,
      buildingWidth: 6,
      pitchDegrees: 15,
      eaveCm: 20,
      wastePercent: 8,
      coveragePerPack: 1.15,
    });

    expect(result.roofArea).toBeCloseTo(79.51, 2);
    expect(result.packs).toBe(75);
    expect(result.ridgeLength).toBe(0);
  });

  it("rejects invalid pitch values", () => {
    expect(() =>
      runKalkulatorDachu({
        roofType: "gable",
        materialType: "tile",
        buildingLength: 10,
        buildingWidth: 8,
        pitchDegrees: 85,
        eaveCm: 20,
        wastePercent: 10,
        coveragePerPack: 5,
      }),
    ).toThrow();
  });
});
