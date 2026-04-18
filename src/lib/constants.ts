export const locales = ["en", "pl", "es", "de", "fr"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export const toolCategories = [
  "converters",
  "calculators",
  "construction-calculators",
  "generators",
  "text-tools",
  "developer-tools",
  "html-tools",
  "date-time",
  "image-tools",
  "security-tools"
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export const siteConfig = {
  name: "ConvertBase.app",
  description:
    "Browse free online tools, converters, calculators and generators for everyday tasks and quick answers.",
  defaultLocale
} as const;
