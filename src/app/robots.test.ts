import { beforeEach, describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  beforeEach(() => {
    process.env.SITE_URL = "https://www.convertbase.app";
  });

  it("publishes the canonical host and sitemap", () => {
    const rules = robots();

    expect(rules.host).toBe("https://www.convertbase.app");
    expect(rules.sitemap).toBe("https://www.convertbase.app/sitemap.xml");
    expect(rules.rules).toEqual({
      userAgent: "*",
      allow: "/"
    });
  });
});
