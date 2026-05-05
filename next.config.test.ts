import { describe, expect, it } from "vitest";
import nextConfig from "./next.config.mjs";

describe("next security headers", () => {
  it("sets site-wide browser security headers", async () => {
    const headerRules = await nextConfig.headers();
    const headers = Object.fromEntries(
      headerRules[0].headers.map((header) => [header.key, header.value])
    );

    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'self'");
    expect(headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("geolocation=()");
  });
});
