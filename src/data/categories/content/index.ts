import calculators from "@/data/categories/content/calculators.json";
import constructionCalculators from "@/data/categories/content/construction-calculators.json";
import converters from "@/data/categories/content/converters.json";
import developerTools from "@/data/categories/content/developer-tools.json";
import generators from "@/data/categories/content/generators.json";
import htmlTools from "@/data/categories/content/html-tools.json";
import imageTools from "@/data/categories/content/image-tools.json";
import securityTools from "@/data/categories/content/security-tools.json";
import textTools from "@/data/categories/content/text-tools.json";
import type { Locale, ToolCategory } from "@/lib/constants";
import type { CategoryHubContent } from "@/lib/tools/discovery";

export const generatedCategoryContent: Partial<
  Record<ToolCategory, Record<Locale, CategoryHubContent>>
> = {
  calculators,
  "construction-calculators": constructionCalculators,
  converters,
  "developer-tools": developerTools,
  generators,
  "html-tools": htmlTools,
  "image-tools": imageTools,
  "security-tools": securityTools,
  "text-tools": textTools
};
