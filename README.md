# 日々 Hibi — SaaS d'apprentissage du japonais

Migration du prototype HTML en application **Next.js 15 (App Router) + TypeScript strict + Tailwind + Supabase**.
Le design du prototype a été porté fidèlement ; le backend (auth, base de données, RLS, révision espacée) est réel.

---

## 1. Ce qui est inclus

- **Auth Supabase** complète : inscription, connexion, mot de passe oublié, OAuth (Google/Apple), déconnexion, protection des routes par middleware.
- **Base de données** : schéma relationnel complet (contenu pédagogique + données utilisateur), **RLS** stricte, **trigger** de création de profil à l'inscription, petit **seed** d'exemple.
- **SRS réel (SM-2)** côté serveur : chaque révision recalcule l'état (facteur de facilité, intervalle, répétitions) et planifie la prochaine échéance.
- **Statistiques réelles** calculées depuis le journal d'activité (`study_sessions`) : mots/phrases appris, séries (streak), précision aux quiz, minutes par jour, leçons terminées.
- **Contenu créé par toi** : tu remplis les tables (pas de génération IA). Un seed d'exemple est fourni pour tester.
- **Abonnements** : table `subscriptions` en *stub* + RLS, variables `STRIPE_*` commentées, `TODO Stripe`. Aucune logique de paiement pour l'instant.
- **Outils IA** : écrans *placeholders* conservés pour le design, **hors MVP** (aucune intégration LLM).

---

## 2. Architecture

```
app/                 Pages (App Router) + API routes
  (marketing)/       Landing publique « / »
  (auth)/            Connexion / inscription / mot de passe oublié
  (app)/             Application protégée (sidebar + topbar)
    dashboard, plan, vocab, phrases, grammar, dialogue, reading, stats, profile
    lesson/[level]/[number]
    tools/...         9 écrans IA (placeholders)
  api/               Endpoints REST (user, contenu, progress, stats…)
  auth/              callback OAuth + signout
components/          UI uniquement (présentation)
  ui, layout, auth, marketing, features, dashboard, forms
server/              Logique métier + accès données (jamais dans les composants)
  users, content, progress (SM-2), stats, subscriptions
lib/                 Clients Supabase, helpers, constantes, validations (Zod)
  supabase/          client (navigateur), server, admin (service role), middleware, db (type canonique)
types/               Types partagés + Database (à régénérer, voir §6)
supabase/            migrations/ (3 fichiers) + seed.sql
middleware.ts        Rafraîchit la session et protège les routes
```

Principe : **les composants React n'accèdent jamais directement à la base**. Ils passent par les API routes ou par les *services* serveur, qui appellent les *repositories*.

---

## 3. Prérequis

- Node.js 18.18+ (recommandé : 20+)
- Un projet **Supabase** (gratuit suffit)

---

## 4. Installation

```bash
npm install
cp .env.example .env.local   # puis renseigne les valeurs (voir §5)
npm run dev                  # http://localhost:3000
```

Autres commandes :

```bash
npm run build        # build de production
npm run start        # lance le build
npm run typecheck    # vérification TypeScript (tsc --noEmit)
npm run db:types     # régénère types/database.types.ts depuis Supabase (voir §6)
```

---

## 5. Variables d'environnement (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...           # Project Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...      # Project Settings → API → anon public
SUPABASE_SERVICE_ROLE_KEY=...          # Project Settings → API → service_role  (SERVEUR UNIQUEMENT)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe — préparé mais NON utilisé (décommente quand tu brancheras les paiements) :
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
```

⚠️ `SUPABASE_SERVICE_ROLE_KEY` ne doit **jamais** être exposée au navigateur. Elle n'est utilisée que par `lib/supabase/admin.ts` (côté serveur), pour écrire le contenu pédagogique.

---

## 6. Configuration Supabase

### a) Appliquer les migrations (dans l'ordre)

Via le **SQL Editor** du dashboard Supabase, exécute successivement :

1. `supabase/migrations/001_initial_schema.sql` — enums, tables, index, triggers `updated_at`
2. `supabase/migrations/002_rls_policies.sql` — Row Level Security
3. `supabase/migrations/003_auth_profile_trigger.sql` — création auto du profil à l'inscription

Puis, pour des données d'exemple :

4. `supabase/seed.sql`

> Avec la CLI Supabase (optionnel) : `supabase db push` applique les migrations d'un projet lié.

### b) Authentification

- Active **Email/Password** dans Authentication → Providers.
- Pour OAuth Google/Apple : configure les providers et ajoute l'URL de redirection
  `…/auth/callback` (ex. `http://localhost:3000/auth/callback`).
- Dans Authentication → URL Configuration, mets `NEXT_PUBLIC_APP_URL` comme Site URL.

### c) Régénérer les types (recommandé)

Le fichier `types/database.types.ts` est écrit à la main (suffisant pour compiler). Pour la version exacte de ton schéma :

```bash
# nécessite la CLI supabase et un projet lié (supabase link)
npm run db:types
```

---

## 7. Tester l'application

1. **Inscription** (`/signup`) : crée un compte → le trigger crée automatiquement le profil **et** les préférences. Confirme l'e-mail si la confirmation est activée.
2. **Connexion** (`/login`) → redirection vers `/dashboard`.
3. **Vocabulaire** (`/vocab`) : parcours les mots, ouvre une fiche détaillée, passe en **Mode révision** (flashcards). Chaque note (À revoir / Difficile / Correct / Facile) appelle l'API SRS et planifie la prochaine échéance.
4. **Stats** (`/stats`) : après quelques révisions, les compteurs (mots appris, série, précision, minutes) se mettent à jour à partir des `study_sessions`.
5. **Données en base** : vérifie dans Supabase que `user_item_progress`, `study_sessions`, `profiles`, `user_preferences` se remplissent — et que la RLS empêche bien de lire les données d'un autre utilisateur.

---

## 8. Ajouter ton contenu

Le contenu se crée dans la base (pas de génération automatique). Tables principales :
`vocab_items`, `phrases`, `grammar_points` (+ `grammar_questions`), `dialogues` (+ `dialogue_lines`, `dialogue_questions`), `readings` (+ `reading_questions`), `lessons` (+ `lesson_items` qui relie une leçon à ses éléments).

Insère via le SQL Editor, l'API Table Editor de Supabase, ou un script utilisant `lib/supabase/admin.ts` (service role, qui contourne la RLS en écriture). Le format JSONB des champs riches de `vocab_items` (lectures, sens, exemples…) est illustré dans `supabase/seed.sql`.

---

## 9. Prochaines étapes (TODO)

- **Stripe** : Checkout + webhook → mise à jour de `subscriptions` via la service role ; restreindre l'écriture de cette table au webhook.
- **Outils IA** : brancher un LLM sur les écrans `tools/*` (correction de phrases dans `sentence_submissions.feedback`, exercices générés, etc.).
- **Audio / TTS** : prononciation et écoute.
- **Régénérer les types** après chaque évolution du schéma (`npm run db:types`).

---

## 10. Notes techniques

- Next 15 : `cookies()` et les `params` de route sont **asynchrones** (`await`).
- Combinaison validée : `next@15.1.6`, `react@19`, `@supabase/supabase-js@2.107`, `@supabase/ssr@0.10.3`, `tailwindcss@3.4`, `zod`.
- Un avertissement de build (`process.version` dans l'Edge Runtime via supabase-js sur le middleware) est **sans conséquence**.
- Le CSS du prototype est porté dans `app/globals.css` (système de design conservé à l'identique) ; le nouveau code peut aussi utiliser Tailwind (tokens mappés dans `tailwind.config.ts`).
