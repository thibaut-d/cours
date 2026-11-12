# Navigation par filtres et publics — plan de réalisation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le « niveau » par un « public » (classe, cycle, professeurs, tout public) et la navigation
niveau → matière → leçon par une page d'accueil unique qui montre toutes les leçons, filtrables par public et
par matière.

**Architecture:** Le modèle des publics (`src/lecon/publics.ts`) remplace `niveaux.ts`. La logique de filtre
est pure et testée (`src/lecon/filtres.ts`) ; la page d'accueil est construite statiquement avec toutes les
tuiles, et un script client (`src/scripts/filtres.ts`) masque ou montre les tuiles selon les filtres, lus dans
l'adresse puis dans le stockage local.

**Tech Stack:** Astro 7 (statique), TypeScript, Zod 4, Vitest, Playwright + axe.

**Spec:** `docs/superpowers/specs/2026-11-12-navigation-publics-design.md` (et, pour tout le reste,
`docs/superpowers/specs/2026-11-10-cours-design.md`).

## Global Constraints

- Tout en français : textes, identifiants, commentaires, messages de commit.
- Commits : aucune ligne `Co-Authored-By` ni mention d'agent ; `git add` avec chemins explicites.
- Contrôles verts avant chaque commit : `pnpm check && pnpm test && pnpm valider && pnpm build && pnpm e2e`.
- Liens internes par `lien()` (`src/lib/lien.ts`) ; site servi sous `/cours`.
- Cibles tactiles ≥ 48 px ; pas de défilement horizontal de 320 à 1280 px ; axe sans violation.
- L'état choisi d'un filtre ne passe pas par la couleur seule (`aria-pressed` + coche visible + fond plein).
- Tout accès à `localStorage` est protégé par try/catch.
- Ne pas pousser : le contrôleur pousse sur `main` à la fin.

## Review Focus

1. Classe ↔ cycle : « 6e » montre les leçons `college` ; un bouton « 6e » existe alors même sans leçon `6e`
   (test unitaire `boutonsPublics`, Task 2).
2. Adresse invalide (`?public=xyz&matiere=inconnue`) : ignorée, la page montre tout (e2e, Task 3).
3. Stockage bloqué : les filtres marchent sans mémoire, aucune erreur (e2e, Task 3).
4. Combinaison vide (public × matière sans leçon) : message + « Tout voir » (e2e, Task 3).
5. Texte agrandi au maximum à 320 px : les rangées de filtres passent à la ligne, pas de défilement
   horizontal (e2e, Task 3).

---

### Task 1: Le public remplace le niveau

**Files:**
- Create: `src/lecon/publics.ts`, `src/lecon/publics.test.ts`
- Delete: `src/lecon/niveaux.ts`
- Modify: `src/lecon/schema.ts`, `src/lecon/schema.test.ts`, `src/lecon/avertissements.ts`,
  `src/lecon/avertissements.test.ts`, `src/lecon/catalogue.ts`, `src/lecon/catalogue.test.ts`,
  `scripts/valider.ts`, `src/components/Fiche.astro`, les pages sous `src/pages/[niveau]/` (renommées
  `src/pages/[public]/`), `contenu/6e/histoire/*/lecon.yaml`, `e2e/contenu-test/**/lecon.yaml`
  (dossier `e2e/contenu-test/sup/` renommé `superieur/`), `e2e/*.spec.ts` (adresses `sup` → `superieur`).

**Interfaces:**
- Produces:
  - `PUBLICS: readonly { id; libelle; sorte: 'classe' | 'cycle' | 'apart'; cycle?: CycleId }[]`, dans
    l'ordre : primaire, cp, ce1, ce2, cm1, cm2, college, 6e, 5e, 4e, 3e, lycee, 2de, 1re, tle, superieur,
    professeurs, tout-public. Libellés : Primaire, CP, CE1, CE2, CM1, CM2, Collège, 6e, 5e, 4e, 3e, Lycée,
    2de, 1re, Terminale, Supérieur, Professeurs, Tout public. `cycle` présent pour les classes seulement.
  - `type PublicId`, `IDS_PUBLICS: [PublicId, ...PublicId[]]`, `trouverPublic(id: PublicId)`.
  - `objectifsDe(id: PublicId): 'college' | 'lycee' | 'superieur'` : primaire et ses classes → college ;
    collège et ses classes → college ; lycée et ses classes → lycee ; superieur, professeurs,
    tout-public → superieur.
  - Schéma : champ `public: z.enum(IDS_PUBLICS)` à la place de `niveau`.

- [ ] **Step 1: Tests de `publics.ts`** (`src/lecon/publics.test.ts`) : ordre des ids exactement comme
  ci-dessus ; `trouverPublic('tle').libelle === 'Terminale'` ; `trouverPublic('6e').cycle === 'college'` ;
  `trouverPublic('college').cycle === undefined` ; `objectifsDe('cm1') === 'college'`,
  `objectifsDe('2de') === 'lycee'`, `objectifsDe('professeurs') === 'superieur'`,
  `objectifsDe('tout-public') === 'superieur'`.
- [ ] **Step 2: Lancer `pnpm test`**, vérifier l'échec (module absent).
- [ ] **Step 3: Écrire `publics.ts`**, supprimer `niveaux.ts`, remplacer `niveau` par `public` dans le
  schéma et ses tests, `avertissements.ts` utilise `OBJECTIFS[objectifsDe(lecon.public)]`.
- [ ] **Step 4: Libellé de matière cohérent.** Ajouter à `catalogue.ts`
  `libellesIncoherents(lecons: EntreeLecon[]): string[]` (un message par matière qui a plusieurs
  `matiereLibelle`, ex. `matière « histoire » : libellés différents « Histoire », « Histoire-géo »`), testé ;
  `scripts/valider.ts` compte chaque message comme une erreur, après l'examen de toutes les leçons valides.
- [ ] **Step 5: Migrer** les leçons (`niveau: 6e` → `public: 6e`) et les données d'essai (`niveau: sup` →
  `public: superieur`, dossier renommé), renommer les dossiers de pages `[niveau]` → `[public]` et le
  paramètre partout (`Fiche.astro` lit `trouverPublic(lecon.public)`), adapter les e2e aux adresses
  `/cours/superieur/…`.
- [ ] **Step 6: Contrôles** : `pnpm check && pnpm test && pnpm valider && pnpm build && pnpm e2e`, tous verts.
- [ ] **Step 7: Commit** — `Le « niveau » d'une leçon devient son « public » (classe, cycle, professeurs, tout public)`.

### Task 2: Logique des filtres

**Files:**
- Create: `src/lecon/filtres.ts`, `src/lecon/filtres.test.ts`

**Interfaces:**
- Consumes: `PUBLICS`, `PublicId`, `trouverPublic` (Task 1) ; `EntreeLecon` (`catalogue.ts`).
- Produces:
  - `publicsCorrespondants(p: PublicId): PublicId[]` : les boutons publics sous lesquels une leçon de public
    `p` apparaît. Une classe → elle-même et son cycle ; un cycle → lui-même et toutes ses classes ; un public
    à part → lui-même.
  - `boutonsPublics(lecons): { id: PublicId; libelle: string }[]` : union des `publicsCorrespondants` des
    leçons, dans l'ordre de `PUBLICS`.
  - `boutonsMatieres(lecons): { matiere: string; libelle: string }[]` : triés par libellé (`localeCompare`
    `'fr'`).
  - `type Filtres = { publics: string[]; matieres: string[] }`.
  - `estMontree(lecon: { public: PublicId; matiere: string }, f: Filtres): boolean` : (aucun public choisi
    ou un public choisi ∈ `publicsCorrespondants(lecon.public)`) **et** (aucune matière choisie ou
    `lecon.matiere` choisie).
  - `nettoyer(f: Filtres, publics: string[], matieres: string[]): Filtres` : retire les valeurs inconnues
    et les doublons.
  - `lireAdresse(search: string): Filtres | null` : `?public=6e,5e&matiere=histoire` (valeurs séparées par
    des virgules) ; `null` si aucun des deux paramètres n'est présent.
  - `ecrireAdresse(f: Filtres): string` : `''` si aucun filtre, sinon `?public=…&matiere=…` (paramètre vide
    omis).
  - `grouperParMatiere(lecons): { matiere; libelle; lecons }[]` : groupes triés par libellé ; dans un
    groupe, ordre de `PUBLICS` du public, puis `ordre`, puis titre.

- [ ] **Step 1: Tests** : 6e → `['6e','college']` ; college → `['college','6e','5e','4e','3e']` ;
  professeurs → `['professeurs']` ; une seule leçon `college` ⇒ `boutonsPublics` = college, 6e, 5e, 4e, 3e
  dans l'ordre de `PUBLICS` ; `estMontree({public:'college',matiere:'histoire'}, {publics:['6e'],matieres:[]})`
  vrai ; même leçon avec `{publics:['lycee'],…}` faux ; `{publics:[],matieres:['svt']}` faux ;
  `lireAdresse('?public=6e,xyz&matiere=')` → `{publics:['6e','xyz'],matieres:[]}` ; `lireAdresse('')` →
  `null` ; `nettoyer` retire `xyz` ; aller-retour `lireAdresse(ecrireAdresse(f))` ;
  `ecrireAdresse({publics:[],matieres:[]}) === ''` ; ordre de `grouperParMatiere` (6e avant college avant
  2de dans un même groupe).
- [ ] **Step 2: `pnpm test`**, vérifier l'échec.
- [ ] **Step 3: Écrire `filtres.ts`** (fonctions pures, sans DOM).
- [ ] **Step 4: Contrôles verts.**
- [ ] **Step 5: Commit** — `Logique des filtres par public et par matière`.

### Task 3: Page d'accueil à filtres

**Files:**
- Modify: `src/pages/index.astro`, `src/styles/global.css`, `src/components/Fiche.astro` (fil d'Ariane),
  `e2e/navigation.spec.ts`, `e2e/contenu-test/` (données d'essai, voir Step 1)
- Create: `src/components/TuileLecon.astro`, `src/scripts/filtres-accueil.ts`
- Delete: `src/pages/[public]/index.astro`, `src/pages/[public]/[matiere]/index.astro`,
  `src/scripts/dernier-niveau.ts`

**Interfaces:**
- Consumes: tout `filtres.ts` (Task 2) ; `leconsVisibles()`, `slugLecon()`, `resoudreImage()`.
- Produces : clé de stockage `cours-filtres` = JSON `Filtres`.

- [ ] **Step 1: Données d'essai** : ajouter une leçon publiée `public: college`, matière `svt` (libellé
  « SVT »), et une leçon publiée `public: professeurs`, matière `intelligence-artificielle`, chacune avec
  le minimum valide (une carte, une source).
- [ ] **Step 2: e2e** (`e2e/navigation.spec.ts`, remplace les tests niveau/matière et « dernier niveau ») :
  - l'accueil montre toutes les leçons publiées et aucun brouillon, un seul `h1`, axe sans violation ;
  - boutons publics présents : 6e, 5e, 4e, 3e, Collège, Supérieur, Professeurs (pas 2de) ;
  - choisir « 6e » : la leçon d'histoire 6e et la leçon SVT collège visibles, la leçon du supérieur
    masquée ; le bouton a `aria-pressed="true"` ; l'adresse contient `public=6e` ;
  - puis choisir la matière « Histoire » : seule la leçon d'histoire reste ;
  - recharger `/cours/` : les filtres sont rétablis (mémoire) ;
  - « Tout voir » : tout réapparaît, adresse sans paramètre ;
  - `/cours/?public=xyz&matiere=inconnue` : tout est visible ;
  - `/cours/?public=professeurs&matiere=svt` : message de liste vide et bouton « Tout voir » ;
  - stockage bloqué : choisir un filtre fonctionne, aucune erreur de page (`page.on('pageerror')`) ;
  - JavaScript désactivé (`javaScriptEnabled: false`) : toutes les leçons visibles, filtres masqués ;
  - fil d'Ariane d'une leçon : « Cours » → `/cours/`, « Histoire » → `/cours/?matiere=histoire` ;
  - `/cours/6e/` et `/cours/6e/histoire/` → 404 ;
  - cibles ≥ 48 px pour les boutons et les tuiles ; à 320 px avec les réglages maximaux, pas de
    défilement horizontal (reprendre l'aide existante des tests de débordement).
- [ ] **Step 3: `pnpm e2e`**, vérifier l'échec.
- [ ] **Step 4: Page** : `index.astro` rend `h1` « Cours », un bloc de filtres (`hidden` dans le HTML,
  affiché par le script) avec deux groupes étiquetés « Public » et « Matière » (`role="group"`,
  `aria-labelledby`), des `<button type="button" aria-pressed>` avec coche SVG visible quand choisi, et
  « Tout voir » ; puis un `<section>` par matière (`h2` = libellé) avec ses tuiles ; chaque tuile porte
  `data-publics` (= `publicsCorrespondants(public)`, séparés par des espaces) et `data-matiere`. Message
  vide (`role="status"`) masqué par défaut. Aucune leçon : « Aucun cours publié pour l'instant. » sans
  filtres.
- [ ] **Step 5: `TuileLecon.astro`** : lien sur toute la tuile vers `lien(\`${public}/${matiere}/${slug}/\`)`,
  image de la première carte qui a un `fichier` (`<Image>` 4:3, largeur 400/800), sinon le picto de la
  première carte qui en a un, sur fond uni ; titre en gras ; deux étiquettes (libellé du public, libellé
  de la matière).
- [ ] **Step 6: `filtres-accueil.ts`** : au chargement, `lireAdresse(location.search)` sinon stockage, puis
  `nettoyer` ; applique (masque tuiles, sections vides, message vide) ; à chaque clic, met à jour
  `aria-pressed`, `history.replaceState` avec `ecrireAdresse`, et le stockage.
- [ ] **Step 7: Fil d'Ariane** de la fiche : Cours (`lien('')`) / matière (`lien(\`?matiere=${matiere}\`)`) /
  titre. Supprimer les pages intermédiaires et `dernier-niveau.ts`.
- [ ] **Step 8: Contrôles verts**, puis captures de l'accueil à 390 et 1280 px (sans filtre et avec « 6e »),
  regardées.
- [ ] **Step 9: Commit** — `Accueil unique : toutes les leçons, filtres par public et par matière retenus`.

### Task 4: Documentation

**Files:**
- Modify: `README.md`, `AGENTS.md` (§ 6 : `public` au lieu de niveau, structure `contenu/<public>/…`),
  `TODO.md` (navigation faite), `docs/superpowers/specs/2026-11-12-navigation-publics-design.md` (rien à
  changer sauf écart constaté).

- [ ] **Step 1: Mettre à jour** les trois fichiers (ce qui change pour qui écrit une leçon : champ
  `public`, valeurs possibles, dossier).
- [ ] **Step 2: Contrôles verts.**
- [ ] **Step 3: Commit** — `Documentation : publics et navigation par filtres`.
