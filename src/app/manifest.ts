import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ConvertBase.app",
    short_name: "ConvertBase",
    description: "Global portal for online tools and converters.",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ],
    start_url: "/en",
    display: "standalone",
    background_color: "#07111f",
    theme_color: "#0891b2"
  };
}
