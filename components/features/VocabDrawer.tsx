"use client";

import type { VocabItemRow } from "@/types/database.types";
import { VocabFiche } from "./VocabFiche";

// Fiche détaillée d'un mot, en tiroir (réutilise les classes du prototype : .drawer, .block…).
// Le corps de la fiche est partagé avec l'aperçu statique via <VocabFiche />.
export function VocabDrawer({ item, onClose }: { item: VocabItemRow | null; onClose: () => void }) {
  if (!item) return null;
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>
        <VocabFiche item={item} />
      </aside>
    </>
  );
}
