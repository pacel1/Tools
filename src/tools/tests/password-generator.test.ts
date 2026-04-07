import { describe, expect, it } from "vitest";
import { runPasswordGenerator } from "@/tools/logic/password-generator";

describe("password-generator", () => {
  it("creates a password with the requested length", () => {
    const result = runPasswordGenerator({ length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false });
    expect(result.password).toHaveLength(20);
  });
});
