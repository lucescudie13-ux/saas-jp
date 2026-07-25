# Illustrations du dragon (gamification)

Les **6 stades d'évolution** sont dessinés ici en **SVG** (vectoriel, fond
transparent, net à toute taille). Ils s'affichent sur la page « Mon dragon » et
sur la carte de l'accueil. Si un fichier est retiré, un emoji de secours prend
le relais automatiquement.

## Fichiers (noms référencés dans `lib/dragon.ts` → `DRAGON_STAGES[].img`)

| Stade        | Fichier             | Débloqué à |
|--------------|---------------------|------------|
| Œuf          | `egg.svg`           | 0 leçon    |
| Éclosion     | `hatchling.svg`     | 3 leçons   |
| Apprenti     | `apprentice.svg`    | 15 leçons  |
| Aventurier   | `adventurer.svg`    | 40 leçons  |
| Maître       | `master.svg`        | 90 leçons  |
| Légendaire   | `legendary.svg`     | 180 leçons |

## Remplacer par des illustrations définitives

Ces SVG sont des **illustrations provisoires** (style chibi navy + or) faites
maison. Pour les remplacer par tes propres visuels :

- **Même format (SVG)** : écrase simplement le fichier, aucun changement de code.
- **PNG / WebP** : dépose `egg.png` (etc.) et change l'extension dans le champ
  `img` de `lib/dragon.ts`. Préfère un **carré à fond transparent** (512×512+),
  sujet centré (il est posé dans un médaillon rond).
