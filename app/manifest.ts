import type { MetadataRoute } from "next";

// Manifest de l'application installable (PWA) — servi sur /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "日々 Hibi — Apprends le japonais",
    short_name: "Hibi",
    description:
      "Apprends le japonais, chaque jour. Un parcours du N5 au N1 avec un dragon qui grandit avec toi.",
    lang: "fr",
    start_url: "/plan",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FBF8F2",
    theme_color: "#C2402F",
    categories: ["education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
