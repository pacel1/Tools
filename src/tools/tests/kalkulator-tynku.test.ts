import { describe, expect, it } from "vitest";
import { runKalkulatorTynku } from "../logic/kalkulator-tynku";

describe("runKalkulatorTynku", () => {
  it("calculates base mass, total mass and bag count", () => {
    const result = runKalkulatorTynku({
      area: 100,
      consumptionPerMm: 1.5,
      layerMm: 10,
      wastePercent: 10,
      bagWeight: 25,
    });

    expect(result.kgBase).toBe(1500);
    expect(result.kgTotal).toBe(1650);
    expect(result.bags).toBe(66);
  });

  it("rounds up bags correctly", () => {
    const result = runKalkulatorTynku({
      area: 12,
      consumptionPerMm: 1.2,
      layerMm: 8,
      wastePercent: 0,
      bagWeight: 25,
    });

    expect(result.kgBase).toBe(115.2);
    expect(result.kgTotal).toBe(115.2);
    expect(result.bags).toBe(5);
  });
});
