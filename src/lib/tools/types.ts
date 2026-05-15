import type { Locale, ToolCategory } from "@/lib/constants";

export type ToolType =
  | "converter"
  | "calculator"
  | "generator"
  | "text-tool"
  | "developer-tool"
  | "date-time-tool"
  | "image-tool"
  | "security-tool";

export type ToolDefinition = {
  id: string;
  type: ToolType;
  category: ToolCategory;
  componentName: string;
  logicModule: string;
  inputSchema: string;
  outputSchema: string;
  supportedLocales: Locale[];
  relatedTools: string[];
  seoPriority: number;
};

export type ToolExample = {
  title: string;
  input: string;
  output: string;
  description: string;
};

export type ToolFaq = {
  question: string;
  answer: string;
};

export type ToolUseCase = {
  title: string;
  description: string;
};

export type ToolLocaleContent = {
  toolId: string;
  locale: Locale;
  slug: string;
  h1: string;
  title: string;
  shortDescription: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  overview: string;
  howItWorks: string[];
  useCases?: Array<string | ToolUseCase>;
  examples: ToolExample[];
  faq: ToolFaq[];
  uiLabels?: Record<string, string>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
};

export type ToolPageModel = {
  definition: ToolDefinition;
  content: ToolLocaleContent;
};
