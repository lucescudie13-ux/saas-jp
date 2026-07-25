import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Mentions légales — Hibi",
  robots: { index: false },
};

export default function MentionsLegales() {
  return (
    <LegalShell title="Mentions légales" updated="25 juillet 2026">
      <p>
        Conformément à l&apos;article 6 de la loi n° 2004-575 du 21 juin 2004
        pour la confiance dans l&apos;économie numérique (LCEN), les présentes
        mentions légales précisent l&apos;identité des différents intervenants du
        site <strong>Hibi</strong>.
      </p>

      <h2>1. Éditeur du site</h2>
      <p>Le site Hibi est édité par :</p>
      <ul>
        <li>Raison sociale / Nom : <span className="todo">[À COMPLÉTER : nom ou raison sociale]</span></li>
        <li>Statut juridique : <span className="todo">[À COMPLÉTER : ex. Entrepreneur individuel / SAS / SASU…]</span></li>
        <li>Adresse : <span className="todo">[À COMPLÉTER : adresse du siège]</span></li>
        <li>SIRET : <span className="todo">[À COMPLÉTER : n° SIRET]</span></li>
        <li>Capital social (si société) : <span className="todo">[À COMPLÉTER, sinon supprimer]</span></li>
        <li>N° de TVA intracommunautaire (si applicable) : <span className="todo">[À COMPLÉTER, sinon supprimer]</span></li>
        <li>E-mail de contact : <span className="todo">[À COMPLÉTER : adresse e-mail]</span></li>
      </ul>

      <h2>2. Directeur de la publication</h2>
      <p>
        Le directeur de la publication est <span className="todo">[À COMPLÉTER : nom du responsable]</span>.
      </p>

      <h2>3. Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong>, 340 S Lemon Ave
        #4133, Walnut, CA 91789, États-Unis —{" "}
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>.
      </p>
      <p>
        La base de données et le service d&apos;authentification sont fournis par{" "}
        <strong>Supabase, Inc.</strong> —{" "}
        <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a>.
        Le traitement des paiements est assuré par <strong>Stripe</strong> —{" "}
        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">stripe.com</a>.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus présents sur le site (structure, textes,
        illustrations, logo, dragon et autres visuels, parcours pédagogique,
        code) est protégé par le droit de la propriété intellectuelle et demeure
        la propriété exclusive de l&apos;éditeur, sauf mention contraire. Toute
        reproduction, représentation, modification ou exploitation, totale ou
        partielle, sans autorisation écrite préalable, est interdite et
        susceptible de constituer une contrefaçon.
      </p>

      <h2>5. Contact</h2>
      <p>
        Pour toute question relative au site, vous pouvez écrire à{" "}
        <span className="todo">[À COMPLÉTER : adresse e-mail de contact]</span>.
      </p>
    </LegalShell>
  );
}
