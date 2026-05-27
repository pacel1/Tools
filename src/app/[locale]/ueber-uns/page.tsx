import type { Metadata } from "next";
import {
  generateLegalPageMetadata,
  generateLegalPageStaticParams,
  renderLegalPage
} from "@/lib/pages/route";
import type { Locale } from "@/lib/constants";

const pageKey = "about" as const;
const routeSegment = "ueber-uns";

export const dynamicParams = false;

export function generateStaticParams() {
  return generateLegalPageStaticParams(pageKey, routeSegment);
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return generateLegalPageMetadata(params, pageKey, routeSegment);
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  return renderLegalPage(params, pageKey, routeSegment);
}
