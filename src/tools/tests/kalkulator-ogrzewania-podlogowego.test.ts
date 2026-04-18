import { describe, expect, it } from "vitest";
import { runKalkulatorOgrzewaniaPodlogowego } from "../logic/kalkulator-ogrzewania-podlogowego";

describe("runKalkulatorOgrzewaniaPodlogowego", () => {
  it("calculates a spiral layout", () => {
    const result = runKalkulatorOgrzewaniaPodlogowego({
      pattern: "spiral",
      area: 90,
      spacingCm: 15,
      maxLoopLength: 100,
      feedLength: 8,
      wastePercent: 5,
    });

    expect(result.fieldPipeLength).toBe(624);
    expect(result.pipeLength).toBeCloseTo(711.2, 1);
    expect(result.loops).toBe(7);
    expect(result.loopLength).toBeCloseTo(101.6, 2);
    expect(result.manifoldPorts).toBe(7);
  });

  it("calculates a single small loop", () => {
    const result = runKalkulatorOgrzewaniaPodlogowego({
      pattern: "meander",
      area: 10,
      spacingCm: 20,
      maxLoopLength: 100,
      feedLength: 5,
      wastePercent: 0,
    });

    expect(result.loops).toBe(1);
    expect(result.loopLength).toBeCloseTo(59, 0);
  });

  it("rejects invalid spacing", () => {
    expect(() =>
      runKalkulatorOgrzewaniaPodlogowego({
        pattern: "spiral",
        area: 20,
        spacingCm: 0,
        maxLoopLength: 100,
        feedLength: 5,
        wastePercent: 0,
      }),
    ).toThrow();
  });
});
