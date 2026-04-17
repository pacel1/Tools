import { describe, expect, it } from "vitest";
import { runContrastChecker } from "@/tools/logic/contrast-checker";

describe("contrast-checker", () => {
  it("reports strong contrast for dark text on white", () => {
    const result = runContrastChecker({
      foreground: "#111827",
      background: "#FFFFFF"
    });

    expect(result.ratio).toBeGreaterThan(10);
    expect(result.aaNormal).toBe(true);
  });
});
