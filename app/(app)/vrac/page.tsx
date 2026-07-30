import Link from "next/link";
import type { Route } from "next";
import { VRAC_GROUPS } from "@/lib/vrac";
import { requireAdmin } from "@/server/access/admin-only";

// Espace de travail interne : brouillons et démonstrations. Réservé aux
// administrateurs — ce n'est pas du contenu destiné aux abonnés.
export default async function VracPage() {
  await requireAdmin();

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Vrac</span>
        <h1>Vrac</h1>
      </div>

      {VRAC_GROUPS.length === 0 ? (
        <p className="empty">
          Rien pour l&apos;instant. Ajoute une idée dans <code>lib/vrac.ts</code>.
        </p>
      ) : (
        VRAC_GROUPS.map((group) => (
          <section key={group.title} className="vrac-group">
            <h2 className="vrac-group-title">{group.title}</h2>
            {group.lessons.length === 0 ? (
              <p className="empty">Rien pour l&apos;instant dans cette catégorie.</p>
            ) : (
              <div className="vrac-list">
                {group.lessons.map((l) => (
                  <Link key={l.slug} href={`/vrac/${l.slug}` as Route} className="block vrac-card">
                    <h3 className="block-title" style={{ margin: 0 }}>{l.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </>
  );
}
