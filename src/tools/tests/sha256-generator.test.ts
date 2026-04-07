import { describe, expect, it } from "vitest";
import { runSha256Generator } from "@/tools/logic/sha256-generator";

describe("sha256-generator", () => {
  it("generates a SHA256 hash", async () => {
    const result = await runSha256Generator({ text: "hello world" });
    expect(result.hash).toHaveLength(64);
  });
});
