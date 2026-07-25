import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // On n'accepte qu'un chemin relatif interne (évite tout redirect ouvert).
  const rawNext = searchParams.get("next") ?? "/plan";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/plan";

  const supabase = await createClient();

  // Flux PKCE (lien de confirmation / OAuth) : échange du code contre une session.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (tokenHash && type) {
    // Flux OTP (selon le modèle d'e-mail Supabase) : vérification du jeton.
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
