import { defaultLocale, locales, type Locale } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";

type PathBuilder = (locale: Locale) => string | null;

function toAbsoluteUrl(path: string) {
  return `${getSiteUrl()}${path}`;
}

export function buildLanguageAlternates(
  getPath: PathBuilder,
  options?: { includeXDefault?: boolean }
) {
  const languages = Object.fromEntries(
    locales.flatMap((locale) => {
      const path = getPath(locale);

      if (!path) {
        return [];
      }

      return [[locale, toAbsoluteUrl(path)]];
    })
  ) as Record<string, string>;

  if (options?.includeXDefault ?? true) {
    const defaultPath = getPath(defaultLocale);

    if (defaultPath) {
      languages["x-default"] = toAbsoluteUrl(defaultPath);
    }
  }

  return { languages };
}
