import { siteConfig } from "@/lib/constants";

export function getSiteUrl(): string {
  const value = process.env.SITE_URL?.trim();

  if (!value) {
    return "http://localhost:3000";
  }

  return value.replace(/\/$/, "");
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini";
}

export function getSiteName(): string {
  return siteConfig.name;
}
