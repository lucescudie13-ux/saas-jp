import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * sitemap.xml — servi sur /sitemap.xml.
 *
 * Uniquement les pages PUBLIQUES : celles qu'un visiteur non connecté peut
 * réellement lire. Y mettre les pages de l'application n'apporterait rien
 * (elles redirigent vers /login) et brouillerait le signal envoyé à Google.
 *
 * `lastModified` est volontairement absent : une date inventée à chaque build
 * apprend à Google à ne plus faire confiance à ce champ. Mieux vaut ne rien
 * dire que de mentir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/telecharger`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/signup`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/conditions`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
