import type { Metadata } from "next";
import { generateLegalPageMetadata, generateLegalPageStaticParams, renderLegalPage } from "@/lib/pages/route";
import type { Locale } from "@/lib/constants";

const pageKey = "disclaimer" as const;

export function generateStaticParams() {
  return generateLegalPageStaticParams();
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return generateLegalPageMetadata(params, pageKey);
}

export default async function DisclaimerPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  return renderLegalPage(params, pageKey);
}
