import { describe, expect, it } from "vitest";
import { run } from "../logic/kalkulator-kostki-brukowej";

describe("kalkulator kostki brukowej", () => {
  it("calculates blocks, packs and edging", () => {
    const result = run({
      area: 100,
      blockWidthCm: 20,
      blockLengthCm: 10,
      wastePercent: 5,
      packCoverage: 10,
      edgingPerSqm: 0.4,
    });

    expect(result.blocks).toBe(5250);
    expect(result.packs).toBe(11);
    expect(result.edgingMeters).toBe(40);
  });

  it("rounds up packs and blocks", () => {
    const result = run({
      area: 12.3,
      blockWidthCm: 30,
      blockLengthCm: 20,
      wastePercent: 10,
      packCoverage: 8,
      edgingPerSqm: 0.25,
    });

    expect(result.blocks).toBe(226);
    expect(result.packs).toBe(2);
    expect(result.edgingMeters).toBe(3.08);
  });
});
