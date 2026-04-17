import { notFound } from "next/navigation";
import type { Locale } from "@/lib/constants";
import {
  buildStorageHubMetadata,
  StorageHubPage
} from "@/lib/tools/storage-hub-page";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (locale !== "en") {
    return {};
  }

  return buildStorageHubMetadata(locale);
}

export default async function EnglishStorageHubPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (locale !== "en") {
    notFound();
  }

  return <StorageHubPage locale={locale} />;
}
