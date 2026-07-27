import { DRAGON_STAGES } from "@/lib/dragon";

// Écran de chargement affiché instantanément à chaque changement de page
// (Suspense de navigation) : l'œuf du dragon fait un demi-tour, s'arrête, en
// refait un — jusqu'à ce que la page soit prête.
//
// L'illustration est celle du stade « œuf » (lib/dragon.ts → DRAGON_STAGES) :
// remplacer le fichier dans public/dragons/ suffit, l'écran suit.
const EGG = DRAGON_STAGES[0]!;

export default function Loading() {
  return (
    <div className="route-loading" aria-busy="true" aria-live="polite" aria-label="Chargement">
      <div className="rl-egg-stage">
        <div className="rl-egg-spin">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rl-egg-img" src={EGG.img} alt="" />
        </div>
        <span className="rl-egg-shadow" aria-hidden />
      </div>
      <p className="rl-egg-label">
        Chargement
        <span className="rl-dots" aria-hidden><i /><i /><i /></span>
      </p>
    </div>
  );
}
