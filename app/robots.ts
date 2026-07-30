import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * robots.txt — servi sur /robots.txt.
 *
 * On interdit tout ce qui est derrière l'authentification. Ces pages ne sont de
 * toute façon pas accessibles à un robot (le middleware redirige vers /login),
 * mais sans cette consigne Google les explore, se fait rediriger, et gaspille
 * son budget d'exploration sur des redirections au lieu des pages qui vendent.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/plan",
        "/lecon/",
        "/bases/",
        "/examen/",
        "/vocab",
        "/grammar",
        "/conjugation",
        "/mot/",
        "/dialogue",
        "/reading",
        "/stats",
        "/aujourdhui",
        "/dragon",
        "/profile",
        "/abonnement",
        "/tools/",
        "/vrac",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
