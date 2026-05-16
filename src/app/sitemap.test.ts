import { beforeEach, describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => {
    process.env.SITE_URL = "https://www.convertbase.app";
  });

  it("uses the canonical www host for every URL", () => {
    const entries = sitemap();

    expect(entries.length).toBeGreaterThan(0);
    expect(
      entries.every((entry) =>
        entry.url.startsWith("https://www.convertbase.app/")
      )
    ).toBe(true);
    expect(
      entries.some((entry) => entry.url.startsWith("https://convertbase.app/"))
    ).toBe(false);
  });

  it("includes the Polish HTML tools hub on the canonical host", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://www.convertbase.app/pl/html-tools");
    expect(urls).not.toContain("https://convertbase.app/pl/html-tools");
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

  it("does not publish empty category hubs", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain("https://www.convertbase.app/en/date-time");
    expect(urls).not.toContain("https://www.convertbase.app/pl/date-time");
  });

  it("publishes security category hubs once the category clears the tool-count threshold", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://www.convertbase.app/en/security-tools");
    expect(urls).toContain("https://www.convertbase.app/pl/security-tools");
  });
});
