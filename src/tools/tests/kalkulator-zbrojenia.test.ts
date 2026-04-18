import { describe, expect, it } from "vitest";
import { runKalkulatorZbrojenia } from "../logic/kalkulator-zbrojenia";

describe("runKalkulatorZbrojenia", () => {
  it("calculates two-way reinforcement", () => {
    const result = runKalkulatorZbrojenia({
      layoutType: "two-way",
      length: 6,
      width: 4,
      spacingCm: 15,
      coverCm: 5,
      lapPercent: 10,
      barLength: 12,
      unitWeight: 0.888,
    });

    expect(result.barsAlongLength).toBe(27);
    expect(result.barsAlongWidth).toBe(40);
    expect(result.totalLength).toBeCloseTo(346.83, 2);
    expect(result.bars).toBe(29);
    expect(result.weight).toBeCloseTo(307.99, 2);
  });

  it("calculates one-way reinforcement", () => {
    const result = runKalkulatorZbrojenia({
      layoutType: "one-way",
      length: 5,
      width: 3,
      spacingCm: 20,
      coverCm: 4,
      lapPercent: 5,
      barLength: 12,
      unitWeight: 0.617,
    });

    expect(result.barsAlongLength).toBe(15);
    expect(result.barsAlongWidth).toBe(0);
    expect(result.bars).toBe(7);
  });

  it("rejects invalid spacing", () => {
    expect(() =>
      runKalkulatorZbrojenia({
        layoutType: "two-way",
        length: 5,
        width: 3,
        spacingCm: 0,
        coverCm: 4,
        lapPercent: 5,
        barLength: 12,
        unitWeight: 0.617,
      }),
    ).toThrow();
  });
});
