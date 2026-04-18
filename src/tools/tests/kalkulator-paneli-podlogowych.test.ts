import { describe, expect, it } from "vitest";
import { runKalkulatorPaneliPodlogowych } from "../logic/kalkulator-paneli-podlogowych";

describe("runKalkulatorPaneliPodlogowych", () => {
  it("calculates panels, packs and waste area", () => {
    const result = runKalkulatorPaneliPodlogowych({
      area: 20,
      panelWidthCm: 20,
      panelLengthCm: 120,
      wastePercent: 10,
      packCoverage: 2.4,
    });

    expect(result.areaWithWaste).toBe(22);
    expect(result.panels).toBe(92);
    expect(result.packs).toBe(10);
  });

  it("throws on invalid input", () => {
    expect(() =>
      runKalkulatorPaneliPodlogowych({
        area: 0,
        panelWidthCm: 20,
        panelLengthCm: 120,
        wastePercent: 10,
        packCoverage: 2.4,
      }),
    ).toThrow();
  });
});
