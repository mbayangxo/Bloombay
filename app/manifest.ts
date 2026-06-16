import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BloomBay — Where you bloom.",
    short_name: "BloomBay",
    description: "A social world for women — friends, clubs, and real-life connection.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf4ec",
    theme_color: "#FF1F7D",
    orientation: "portrait",
    categories: ["social", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home-full-v4.png",
        sizes: "1170x2532",
        type: "image/png",
        form_factor: "narrow",
        label: "BloomBay Home",
      },
    ],
  };
}
