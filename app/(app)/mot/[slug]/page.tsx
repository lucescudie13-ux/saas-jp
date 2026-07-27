import Link from "next/link";
import type { Route } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { FicheView, type FicheItem } from "@/components/features/FicheView";

/** Page « fiche » autonome d'un mot du vocabulaire (cible des liens info-bulle). */
export default async function MotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  if (!current) redirect("/login");
  const { data } = await db.from("vocab_items").select("*").eq("slug", slug).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <div className="page-head">
        <Link href={"/vocab" as Route} className="vrac-back">← Vocabulaire</Link>
        <span className="pill-tag">{data.level} · Vocabulaire</span>
        <h1>{data.lemma}</h1>
      </div>
      <div className="lr-fullview">
        <FicheView item={data as unknown as FicheItem} />
      </div>
    </>
  );
}
