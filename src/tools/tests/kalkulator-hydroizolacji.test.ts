import { describe, expect, it } from "vitest";
import { runKalkulatorHydroizolacji } from "../logic/kalkulator-hydroizolacji";

describe("runKalkulatorHydroizolacji", () => {
  it("calculates bathroom waterproofing", () => {
    const result = runKalkulatorHydroizolacji({
      surfaceType: "bathroom",
      area: 20,
      coats: 2,
      coverage: 1.2,
      wastePercent: 10,
      packSize: 5,
      tapeMeters: 18,
    });

    expect(result).toEqual({
      quantityBase: 33.33,
      quantityTotal: 36.67,
      packs: 8,
      tapeLength: 19.8,
    });
  });

  it("calculates foundation waterproofing", () => {
    const result = runKalkulatorHydroizolacji({
      surfaceType: "foundation",
      area: 45,
      coats: 2,
      coverage: 0.8,
      wastePercent: 12,
      packSize: 20,
      tapeMeters: 0,
    });

    expect(result.quantityTotal).toBe(126);
    expect(result.packs).toBe(7);
  });

  it("rejects zero pack size", () => {
    expect(() =>
      runKalkulatorHydroizolacji({
        surfaceType: "balcony",
        area: 10,
        coats: 2,
        coverage: 1,
        wastePercent: 5,
        packSize: 0,
        tapeMeters: 8,
      }),
    ).toThrow();
  });
});
