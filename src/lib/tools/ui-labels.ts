"use client";

import { useLocale } from "next-intl";
import { defaultLocale, type Locale } from "@/lib/constants";
import { toolContent } from "@/lib/tools/tool-content.generated";

export function useToolUiLabels<T extends Record<string, string>>(
  toolId: string,
  fallback: T
) {
  const locale = useLocale() as Locale;
  const localized = toolContent[locale]?.[toolId]?.uiLabels;
  const defaultLabels = toolContent[defaultLocale]?.[toolId]?.uiLabels;

  return {
    ...fallback,
    ...defaultLabels,
    ...localized
  } as T & Record<string, string>;
}
