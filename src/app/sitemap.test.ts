import { beforeEach, describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    process.env.SITE_URL = "https://www.convertbase.app";
  });

  it("uses the canonical www host for every URL", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    expect(entries.every((entry) => entry.url.startsWith("https://www.convertbase.app/"))).toBe(
      true
    );
  });

  it("excludes noindex legal pages from the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain("https://www.convertbase.app/en/privacy");
    expect(urls).not.toContain("https://www.convertbase.app/en/terms");
    expect(urls).not.toContain("https://www.convertbase.app/en/cookies");
    expect(urls).not.toContain("https://www.convertbase.app/en/disclaimer");
    expect(urls).toContain("https://www.convertbase.app/en/about");
    expect(urls).toContain("https://www.convertbase.app/en/contact");
  });

  it("includes x-default alternates for canonical entries", () => {
    const homeEntry = sitemap().find(
      (entry) => entry.url === "https://www.convertbase.app/en"
    );

    expect(homeEntry?.alternates?.languages?.["x-default"]).toBe(
      "https://www.convertbase.app/en"
    );
  });
});
