import { describe, expect, it } from "vitest";
import { getSeoRedirect } from "@/lib/seo/redirects";

describe("getSeoRedirect", () => {
  it("redirects the apex host to the canonical www host with a 301", () => {
    const redirect = getSeoRedirect(
      new URL("https://convertbase.app/abc?x=1")
    );

    expect(redirect).toEqual({
      destination: "https://www.convertbase.app/abc?x=1",
      permanent: true,
      statusCode: 301
    });
  });

  it("redirects the canonical root URL to the default locale with a 308", () => {
    const redirect = getSeoRedirect(new URL("https://www.convertbase.app/"));

    expect(redirect).toEqual({
      destination: "https://www.convertbase.app/en",
      permanent: true,
      statusCode: 308
    });
  });

  it("does not redirect canonical locale pages", () => {
    expect(getSeoRedirect(new URL("https://www.convertbase.app/fr"))).toBeNull();
  });
});
