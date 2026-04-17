import { describe, expect, it } from "vitest";
import { runStorageConverter } from "@/tools/logic/storage-converter";

describe("storage-converter", () => {
  it("converts GB to MB with the binary 1024 ratio", () => {
    const result = runStorageConverter({ value: 2, fromUnit: "GB", toUnit: "MB" });

    expect(result.result).toBe(2048);
    expect(result.formatted).toBe("2048");
  });
});
