import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/auth", "/", "/conditions", "/confidentialite", "/mentions-legales", "/telecharger", "/manifest.webmanifest", "/sw.js", "/api/stripe/webhook"];

// Chemins accessibles à un utilisateur CONNECTÉ mais NON abonné (quand le paywall
// est actif) : la page d'abonnement (pour payer) et le profil (pour se déconnecter).
const PAYWALL_EXEMPT = ["/abonnement", "/profile"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith("/auth")
  );
}

function paywallExempt(pathname: string) {
  return (
    isPublic(pathname) ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    PAYWALL_EXEMPT.some((p) => pathname === p || pathname.startsWith(p + "/"))
  );
}

/**
 * Rafraîchit la session sur chaque requête et protège les routes privées.
 * Appelé depuis le middleware racine.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : ne rien exécuter entre createServerClient et getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Non connecté + route privée → redirection login.
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // Connecté + page d'auth → redirection vers l'accueil de l'app (le plan d'étude).
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/plan";
    return NextResponse.redirect(url);
  }

  // Paywall (accès réservé aux comptes payants) — ACTIF seulement si
  // PAYWALL_ENABLED="true". Les e-mails de PAYWALL_BYPASS_EMAILS (dont le tien)
  // gardent toujours l'accès. Sans abonnement actif → redirection vers /abonnement.
  if (user && process.env.PAYWALL_ENABLED === "true" && !paywallExempt(pathname)) {
    const bypass = (process.env.PAYWALL_BYPASS_EMAILS ?? "")
      .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const email = (user.email ?? "").toLowerCase();
    if (!email || !bypass.includes(email)) {
      const { data: sub } = await supabase
        .from("subscriptions").select("status").eq("user_id", user.id).maybeSingle();
      if (sub?.status !== "active") {
        const url = request.nextUrl.clone();
        url.pathname = "/abonnement";
        url.searchParams.set("paywall", "1");
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}
