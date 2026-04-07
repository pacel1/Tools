import { keywordDensityCheckerInputSchema, keywordDensityCheckerOutputSchema, type KeywordDensityCheckerInput, type KeywordDensityCheckerOutput } from "@/tools/schema/keyword-density-checker";

export function runKeywordDensityChecker(input: KeywordDensityCheckerInput): KeywordDensityCheckerOutput {
  const parsed = keywordDensityCheckerInputSchema.parse(input);
  const words = parsed.text.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const keyword = parsed.keyword.trim().toLowerCase();
  const secondary = keyword ? words.filter((word) => word === keyword).length : 0;
  const tertiary = words.length;
  const primary = tertiary === 0 ? 0 : Number(((secondary / tertiary) * 100).toFixed(2));
  return keywordDensityCheckerOutputSchema.parse({ primary, secondary, tertiary, formatted: primary.toFixed(2) + "%" });
}

export const toolLogic = runKeywordDensityChecker;
