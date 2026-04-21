import { defaultLocale } from "@/lib/constants";

type RedirectResult = {
  destination: string;
  permanent: boolean;
  statusCode: 301 | 308;
};

export function getSeoRedirect(url: URL): RedirectResult | null {
  if (url.hostname === "convertbase.app") {
    const destination = new URL(url.toString());
    destination.protocol = "https:";
    destination.hostname = "www.convertbase.app";

    return {
      destination: destination.toString(),
      permanent: true,
      statusCode: 301
    };
  }

  if (url.hostname === "www.convertbase.app" && url.pathname === "/") {
    const destination = new URL(url.toString());
    destination.pathname = `/${defaultLocale}`;

    return {
      destination: destination.toString(),
      permanent: true,
      statusCode: 308
    };
  }

  return null;
}
