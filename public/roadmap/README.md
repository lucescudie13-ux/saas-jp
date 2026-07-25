# Carte d'aventure des leçons

Dépose ici l'illustration de la carte (village paisible → antre du dragon) sous
le nom **`adventure-map.png`** :

```
public/roadmap/adventure-map.png
```

Elle s'affiche automatiquement en fond de la « route des leçons » (Plan d'étude →
Partie 2). Tant qu'elle n'est pas présente, un dégradé d'ambiance
(vert → bleu → rouge) prend le relais — les pastilles de leçons fonctionnent
dans les deux cas.

## Conseils
- **Format paysage** (l'image fournie ~2.35:1 convient très bien).
- Idéalement une version **sans les pastilles peintes**, pour que seules les
  pastilles interactives (numérotées, cliquables) apparaissent. Sinon les deux
  se superposent.
- Les positions des pastilles (x%, y%) sont définies dans
  `components/features/LessonPath.tsx` (`coords`) et s'ajustent facilement pour
  coller exactement au chemin peint.
- `.webp` fonctionne aussi : renomme alors la référence dans
  `app/globals.css` (`.map-inner` → `background-image`) et
  `components/features/LessonPath.tsx` (`MAP_IMG`).
