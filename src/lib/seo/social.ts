import type { Metadata } from "next";
import { getSiteName, getSiteUrl } from "@/lib/env";

const socialImageWidth = 1200;
const socialImageHeight = 630;

export function getSocialImageUrl(locale: string) {
  return `${getSiteUrl()}/${locale}/opengraph-image`;
}

export function getSocialImageAlt() {
  return `${getSiteName()} online tools`;
}

export function buildSocialMetadata({
  title,
  description,
  url,
  locale,
  type = "website"
}: {
  title: string;
  description: string;
  url: string;
  locale: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = {
    url: new URL(getSocialImageUrl(locale)),
    width: socialImageWidth,
    height: socialImageHeight,
    alt: getSocialImageAlt()
  };

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: getSiteName(),
      locale,
      type,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}
