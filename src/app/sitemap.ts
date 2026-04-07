import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { legalPageKeys } from "@/lib/pages/types";
import { getAllToolPaths } from "@/lib/tools/registry";
import { locales, toolCategories } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  const staticEntries = [
    ...locales.map((locale) => ({
      url: `${baseUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: 0.8
    })),
    ...locales.flatMap((locale) =>
      toolCategories.map((category) => ({
        url: `${baseUrl}/${locale}/${category}`,
        changeFrequency: "weekly" as const,
        priority: 0.75
      }))
    ),
    ...locales.flatMap((locale) =>
      legalPageKeys.map((pageKey) => ({
        url: `${baseUrl}/${locale}/${pageKey}`,
        changeFrequency: "monthly" as const,
        priority: 0.45
      }))
    )
  ];

  const toolEntries = getAllToolPaths().map((path) => ({
    url: `${baseUrl}/${path.locale}/${path.category}/${path.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9
  }));

  return [...staticEntries, ...toolEntries];
}
