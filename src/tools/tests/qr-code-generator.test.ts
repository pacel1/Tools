import { describe, expect, it } from "vitest";
import { runQrCodeGenerator } from "@/tools/logic/qr-code-generator";

describe("qr-code-generator", () => {
  it("returns SVG output", async () => {
    const result = await runQrCodeGenerator({ text: "https://example.com", size: 256, margin: 1, errorCorrectionLevel: "M", foreground: "#111827", background: "#ffffff" });
    expect(result.svg).toContain("<svg");
  });
});
