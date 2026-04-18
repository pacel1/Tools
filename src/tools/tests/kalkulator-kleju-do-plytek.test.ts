import { describe, expect, it } from "vitest";
import { run } from "../logic/kalkulator-kleju-do-plytek";

describe("kalkulator kleju do plytek", () => {
  it("calculates base kg, total kg and bags", () => {
    const result = run({
      area: 12,
      consumptionPerMm: 1.6,
      layerMm: 4,
      wastePercent: 10,
      bagWeight: 25,
    });

    expect(result.kgBase).toBe(76.8);
    expect(result.kgTotal).toBe(84.48);
    expect(result.bags).toBe(4);
  });

  it("rounds bags up to whole units", () => {
    const result = run({
      area: 5,
      consumptionPerMm: 2,
      layerMm: 3,
      wastePercent: 0,
      bagWeight: 10,
    });

    expect(result.kgBase).toBe(30);
    expect(result.kgTotal).toBe(30);
    expect(result.bags).toBe(3);
  });
});
