import { notFound } from "next/navigation";
import type { Locale } from "@/lib/constants";
import {
  buildStorageHubMetadata,
  StorageHubPage
} from "@/lib/tools/storage-hub-page";

export function generateStaticParams() {
  return [{ locale: "de" }];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (locale !== "de") {
    return {};
  }

  return buildStorageHubMetadata(locale);
}

export default async function GermanStorageHubPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (locale !== "de") {
    notFound();
  }

  return <StorageHubPage locale={locale} />;
}
