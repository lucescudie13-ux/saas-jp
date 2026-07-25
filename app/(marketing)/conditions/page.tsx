import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";

export const metadata: Metadata = {
  title: "Conditions d'utilisation et de vente — Hibi",
  robots: { index: false },
};

export default function Conditions() {
  return (
    <LegalShell title="Conditions générales d'utilisation et de vente" updated="25 juillet 2026">
      <p>
        Les présentes conditions générales (les « Conditions ») régissent
        l&apos;accès et l&apos;utilisation du service Hibi (le « Service »), une
        plateforme d&apos;apprentissage du japonais. En créant un compte, vous
        acceptez sans réserve les présentes Conditions.
      </p>

      <h2>1. Objet</h2>
      <p>
        Hibi propose un parcours d&apos;apprentissage du japonais structuré par
        niveau JLPT (du N5 au N1) : vocabulaire, grammaire, conjugaison,
        compréhension, expression, révision espacée et suivi de progression sous
        forme ludique.
      </p>

      <h2>2. Acceptation des Conditions</h2>
      <p>
        L&apos;utilisation du Service implique l&apos;acceptation pleine et
        entière des présentes Conditions. Si vous n&apos;acceptez pas ces
        Conditions, vous ne devez pas utiliser le Service.
      </p>

      <h2>3. Compte utilisateur</h2>
      <ul>
        <li>La création d&apos;un compte requiert une adresse e-mail valide et un mot de passe.</li>
        <li>Vous vous engagez à fournir des informations exactes et à préserver la confidentialité de vos identifiants.</li>
        <li>Vous êtes responsable de toute activité effectuée depuis votre compte.</li>
        <li>Le Service s&apos;adresse aux personnes de 15 ans et plus ; les mineurs doivent obtenir l&apos;accord de leur représentant légal.</li>
      </ul>

      <h2>4. Offres et tarifs</h2>
      <p>Le Service est proposé selon les formules suivantes :</p>
      <ul>
        <li><strong>Gratuit</strong> : accès au niveau N5.</li>
        <li><strong>Abonnement mensuel</strong> : 14,99 € par mois, sans engagement, donnant accès à l&apos;ensemble des niveaux et fonctionnalités.</li>
        <li><strong>Accès à vie</strong> : 197 € en un paiement unique, donnant un accès permanent à l&apos;ensemble des contenus et aux mises à jour.</li>
      </ul>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. L&apos;éditeur se
        réserve le droit de modifier ses tarifs ; le prix applicable est celui en
        vigueur au moment de la commande. Toute modification de prix est sans
        effet sur les abonnements en cours et sur les accès à vie déjà acquis.
      </p>

      <h2>5. Paiement</h2>
      <p>
        Les paiements sont traités de manière sécurisée par notre prestataire
        Stripe. Pour l&apos;abonnement mensuel, le paiement est prélevé
        automatiquement à chaque période, jusqu&apos;à résiliation. L&apos;accès à
        vie fait l&apos;objet d&apos;un paiement unique.
      </p>

      <h2>6. Droit de rétractation</h2>
      <p>
        Conformément aux articles L221-18 et suivants du Code de la consommation,
        vous disposez en principe d&apos;un délai de rétractation de 14 jours pour
        les contrats conclus à distance.
      </p>
      <p>
        Toutefois, le Service consistant en la fourniture d&apos;un contenu
        numérique et l&apos;accès étant fourni immédiatement, vous reconnaissez et
        acceptez expressément, en validant votre commande, que
        l&apos;exécution commence immédiatement et <strong>renoncer à votre droit
        de rétractation</strong> dès que l&apos;accès au contenu payant vous est
        ouvert (article L221-28, 13° du Code de la consommation).
      </p>

      <h2>7. Résiliation</h2>
      <ul>
        <li><strong>Abonnement mensuel</strong> : résiliable à tout moment depuis votre espace ou sur simple demande. La résiliation met fin au renouvellement ; l&apos;accès reste ouvert jusqu&apos;à la fin de la période déjà payée. Aucun remboursement au prorata n&apos;est dû.</li>
        <li><strong>Accès à vie</strong> : acquis de manière définitive, il n&apos;est pas résiliable et ne fait pas l&apos;objet d&apos;un remboursement au-delà des cas prévus par la loi.</li>
        <li>L&apos;éditeur peut suspendre ou résilier un compte en cas de manquement aux présentes Conditions.</li>
      </ul>

      <h2>8. Disponibilité et responsabilité</h2>
      <p>
        L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du Service
        24h/24, sans pouvoir la garantir de manière absolue (maintenance, panne,
        cas de force majeure). Le Service est fourni « en l&apos;état ». Hibi est
        un outil pédagogique : aucun résultat, niveau ou réussite à un examen
        (notamment le JLPT) n&apos;est garanti, la progression dépendant de
        l&apos;implication de l&apos;utilisateur.
      </p>

      <h2>9. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du Service est protégé par le droit de la
        propriété intellectuelle. Votre abonnement vous confère un droit
        d&apos;usage personnel et non exclusif, à des fins d&apos;apprentissage.
        Toute reproduction ou diffusion non autorisée est interdite.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre{" "}
        <a href="/confidentialite">Politique de confidentialité</a>.
      </p>

      <h2>11. Modification des Conditions</h2>
      <p>
        L&apos;éditeur peut modifier les présentes Conditions à tout moment. La
        version applicable est celle en vigueur à la date d&apos;utilisation du
        Service. Les modifications substantielles vous seront notifiées.
      </p>

      <h2>12. Droit applicable et litiges</h2>
      <p>
        Les présentes Conditions sont soumises au droit français. En cas de
        litige, une solution amiable sera recherchée en priorité. Conformément à
        la réglementation, le consommateur peut recourir gratuitement à un
        médiateur de la consommation :{" "}
        <span className="todo">[À COMPLÉTER : nom et coordonnées du médiateur de la consommation]</span>.
        À défaut d&apos;accord, les tribunaux français seront compétents.
      </p>
    </LegalShell>
  );
}
