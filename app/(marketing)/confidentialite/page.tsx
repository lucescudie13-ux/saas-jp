import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Hibi",
  robots: { index: false },
};

export default function Confidentialite() {
  return (
    <LegalShell title="Politique de confidentialité" updated="25 juillet 2026">
      <p>
        La présente politique décrit la manière dont Hibi collecte, utilise et
        protège vos données personnelles, conformément au Règlement général sur
        la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données est l&apos;éditeur du site (voir
        les <a href="/mentions-legales">mentions légales</a>). Pour toute question
        relative à vos données, contactez :{" "}
        <span className="todo">[À COMPLÉTER : adresse e-mail de contact]</span>.
      </p>

      <h2>2. Données que nous collectons</h2>
      <ul>
        <li><strong>Données de compte</strong> : adresse e-mail, nom affiché (pseudo), mot de passe (stocké de façon chiffrée / haché, jamais en clair).</li>
        <li><strong>Données d&apos;apprentissage</strong> : niveau JLPT, objectif, leçons validées et progression, nom donné à votre dragon.</li>
        <li><strong>Données de paiement</strong> : en cas d&apos;abonnement, les informations de paiement sont traitées directement par Stripe. Nous ne stockons jamais votre numéro de carte ; nous conservons uniquement un identifiant client et le statut de votre abonnement.</li>
        <li><strong>Données techniques</strong> : données strictement nécessaires au fonctionnement (cookies de session), et le cas échéant journaux de connexion générés par nos hébergeurs.</li>
      </ul>

      <h2>3. Finalités et bases légales</h2>
      <ul>
        <li>Créer et gérer votre compte — <em>exécution du contrat</em>.</li>
        <li>Fournir le service d&apos;apprentissage et sauvegarder votre progression — <em>exécution du contrat</em>.</li>
        <li>Gérer les abonnements et paiements — <em>exécution du contrat</em> et <em>obligation légale</em> (comptabilité).</li>
        <li>Assurer la sécurité et prévenir la fraude — <em>intérêt légitime</em>.</li>
        <li>Vous adresser des communications relatives au service — <em>exécution du contrat</em> ou <em>consentement</em> pour les communications non essentielles.</li>
      </ul>

      <h2>4. Destinataires et sous-traitants</h2>
      <p>
        Vos données ne sont ni vendues ni louées. Elles sont accessibles à nos
        sous-traitants techniques, uniquement dans la mesure nécessaire au
        service :
      </p>
      <ul>
        <li><strong>Supabase, Inc.</strong> — hébergement de la base de données et authentification.</li>
        <li><strong>Stripe</strong> — traitement des paiements et de la facturation.</li>
        <li><strong>Vercel, Inc.</strong> — hébergement de l&apos;application.</li>
      </ul>
      <p>
        Certains de ces prestataires sont situés hors de l&apos;Union européenne.
        Les transferts éventuels sont encadrés par des garanties appropriées
        (clauses contractuelles types de la Commission européenne).
      </p>

      <h2>5. Durée de conservation</h2>
      <p>
        Vos données de compte et de progression sont conservées tant que votre
        compte est actif. En cas de suppression du compte, elles sont effacées ou
        anonymisées sous 30 jours, sauf obligation légale de conservation (par
        exemple, les données de facturation conservées 10 ans conformément à la
        législation comptable).
      </p>

      <h2>6. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles pour
        protéger vos données : chiffrement des mots de passe, connexions
        sécurisées (HTTPS), cloisonnement des accès à la base de données et
        journalisation. Aucun système n&apos;étant infaillible, nous ne pouvons
        garantir une sécurité absolue.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Hibi utilise uniquement des cookies strictement nécessaires à son
        fonctionnement (maintien de votre session de connexion). Ces cookies ne
        servent pas à la publicité et ne nécessitent pas de consentement
        préalable. Nous n&apos;utilisons pas de cookies publicitaires ni de
        traçage tiers à des fins marketing.
      </p>

      <h2>8. Vos droits</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li>droit d&apos;accès, de rectification et d&apos;effacement de vos données ;</li>
        <li>droit à la limitation et à l&apos;opposition au traitement ;</li>
        <li>droit à la portabilité de vos données ;</li>
        <li>droit de définir des directives sur le sort de vos données après votre décès.</li>
      </ul>
      <p>
        Pour exercer ces droits, écrivez à{" "}
        <span className="todo">[À COMPLÉTER : adresse e-mail de contact]</span>.
        Vous pouvez également introduire une réclamation auprès de la CNIL
        (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
      </p>

      <h2>9. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. Toute modification substantielle
        sera portée à votre connaissance par un moyen approprié. La date de
        dernière mise à jour figure en haut de cette page.
      </p>
    </LegalShell>
  );
}
