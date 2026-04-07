import { describe, expect, it } from "vitest";
import { runUuidGenerator } from "@/tools/logic/uuid-generator";

describe("uuid-generator", () => {
  it("creates the requested number of UUIDs", () => {
    const result = runUuidGenerator({ count: 2 });
    expect(result.values).toHaveLength(2);
  });
});
