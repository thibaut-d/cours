# Socle du site et fiche défilante — plan de réalisation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un site Astro statique publié sur GitHub Pages, avec la navigation niveau → matière → leçon, la fiche « une idée par carte » complète (carte d'ensemble, formule, questions qui peuvent tomber, écouter, réglages) et la leçon pilote *Paléolithique* en brouillon, images encore « à générer ».

**Architecture:** Un seul paquet Astro 7, sortie statique, base `/cours`. Chaque leçon est un fichier `lecon.yaml` dans `contenu/<niveau>/<matiere>/<lecon>/`, validé par un schéma Zod écrit en TypeScript pur (testable par Vitest) et branché sur une collection de contenu Astro. Les comportements du navigateur (écouter, réglages, questions, dernier niveau) sont de petits scripts sans framework.

**Tech Stack:** Node 22, pnpm 10, Astro ^7.3.3, Zod ^4.6.5, YAML (paquet `yaml` ^2), Vitest ^3.2.7, Playwright ^1.63.0 + @axe-core/playwright ^4.13.0, GitHub Actions → GitHub Pages.

**Spec:** [docs/superpowers/specs/2026-11-10-cours-design.md](../specs/2026-11-10-cours-design.md) (« spec § n ») et la recherche [docs/recherche/2026-11-10-mise-en-page-dyslexie.md](../../recherche/2026-11-10-mise-en-page-dyslexie.md) (« R § n »).

**Plans suivants** (un plan chacun, dans cet ordre) : 2. circuit des images avec Codex et images de la leçon pilote, puis sa publication ; 3. diaporama, PDF et PowerPoint ; 4. recette « créer une leçon » (depuis des fichiers, depuis le programme officiel) et conversion du cours *Introduction to NLP* ; 5. charte graphique (TODO.md).

## Global Constraints

- **Vie privée** : aucun détail personnel sur l'auteur, sa famille ou un élève dans un fichier versionné, un commit ou le site. Le contexte personnel est dans `prive/` (ignoré par Git) ; ne jamais en recopier quoi que ce soit (spec § 7).
- `sources/`, `prive/`, `.superpowers/` restent ignorés par Git (déjà dans `.gitignore`).
- Hébergement : GitHub Pages du dépôt public `thibaut-d/cours` → `site: 'https://thibaut-d.github.io'`, `base: '/cours'` ; tout lien interne passe par la base.
- Police de lecture : **Luciole** (400 et 700, woff2, CC BY 4.0, attribution obligatoire), repli Atkinson Hyperlegible ; aucune police « dyslexie ».
- Phrase de carte : 20-22 px au téléphone, `line-height: 1.5`, alignée à gauche, jamais `text-align: justify`, `hyphens: none`, ≤ 60 caractères par ligne (`max-width: 60ch`).
- Mot-clé : 28-36 px, gras, en minuscules telles qu'écrites dans la leçon (jamais `text-transform: uppercase`).
- Étiquettes de structure (« À RETENIR », « EXEMPLE »…) : MAJUSCULES accentuées écrites telles quelles, 1-2 mots, `letter-spacing: 0.05em`.
- Espacement par défaut : lettres `+0.05em`, mots `+0.16em` ; option « aéré » : lettres `+0.12em`, mots `+0.3em`.
- Fond crème `#FBF7EE`, texte `#1E1E1E` ; contraste ≥ 4,5:1 (≥ 3:1 au-delà de 24 px).
- Jamais d'italique ni de souligné pour mettre en valeur (y compris `<em>` : `font-style: normal`, gras).
- Pictogrammes : SVG unis recolorables (`currentColor`) ; **aucun emoji** nulle part.
- Cibles tactiles ≥ 48 px ; zoom jamais bloqué (pas de `maximum-scale`, pas de `user-scalable=no`).
- Largeurs contrôlées : 320, 375, 390, 768, 1280 px.
- Aucun sens de couleur figé dans le code : palette remplaçable, attribuée par défaut selon le rang de la carte, en attendant la charte (TODO.md).
- Images : jamais de texte dans une image ; mention « Image générée » sur chaque image générée.
- Pas d'exercice : ni quiz, ni score, ni rappel ; seules les « questions qui peuvent tomber », réponse visible par défaut (spec § 4.4).
- Langue de chaque leçon = sa langue d'origine (`fr` ou `en`), attribut `lang` de la page en conséquence.
- Textes du site en français, tutoiement, phrases courtes ; messages de commit en français.
- `git add` avec des chemins explicites, jamais `git add -A` ni `git add .`.
- Commits : **aucune ligne `Co-Authored-By`** ni autre mention d'un agent (Claude, Codex) dans les messages ; l'identité Git du dépôt utilise l'adresse anonyme GitHub (`4925720+thibaut-d@users.noreply.github.com`, réglée localement), jamais une adresse personnelle (décision de l'auteur, 2026-11-10). `AGENTS.md` reprend ces deux règles.

## Review Focus

1. **Lien cassé sous `/cours`** : un lien écrit `/6e/...` au lieu de passer par la base marche en local et casse sur GitHub Pages → Task 1 et Task 4 testent le site **construit** servi sous `/cours/`.
2. **Brouillon publié par erreur** : une leçon `statut: brouillon` ne doit apparaître ni dans les listes ni comme page dans `dist/` d'une construction normale, ni rendre visible son niveau ou sa matière → test e2e en Task 4 et test unitaire en Task 3.
3. **Leçon publiée avec une image « à générer »** : doit faire échouer la validation, pas afficher un cadre vide sur le site public → test en Task 3.
4. **Navigateur sans stockage ou sans synthèse vocale** (navigation privée, iOS restreint) : réglages, dernier niveau et écouter doivent échouer en silence, la page reste lisible et le bouton écouter disparaît → tests en Task 6.
5. **Débordement horizontal à 320 px** (mot-clé long comme « anthropologique », frise, étiquettes posées sur une image) → test e2e à 320 px en Task 5 avec une leçon d'essai qui contient un mot long.

---

### Task 1 : Socle Astro, styles de lecture et contrat des agents

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`
- Create: `src/layouts/Base.astro`, `src/styles/global.css`, `src/lib/lien.ts`, `src/pages/index.astro` (provisoire, remplacée en Task 4)
- Create: `public/fonts/luciole-400.woff2`, `public/fonts/luciole-700.woff2`, `public/fonts/atkinson-hyperlegible-400.woff2`, `public/fonts/atkinson-hyperlegible-700.woff2`, `public/fonts/LICENSES.md` (copiés depuis `C:\code\capsicum\apps\web\public\fonts\`, licences reprises pour ces deux polices seulement)
- Modify: `AGENTS.md`, `CLAUDE.md` (déjà créés avec les règles vie privée, commits et « une question à la fois » : les compléter sans retirer ces règles)
- Create: `README.md` (remplace l'actuel)
- Modify: `.gitignore` (ajouter `/dist/`, `/.astro/`, `/test-results/`, `/playwright-report/`)
- Test: `src/lib/lien.test.ts`, `e2e/socle.spec.ts`

**Interfaces:**
- Produces: `lien(chemin: string): string` — préfixe la base (`import.meta.env.BASE_URL`), sans double barre, garde la barre finale : `lien('/6e/')` → `/cours/6e/`, `lien('6e/histoire/')` → `/cours/6e/histoire/`.
- Produces: `Base.astro` props `{ titre: string; langue?: 'fr' | 'en'; description?: string }`, un `<slot />` dans `<main>` ; le `<head>` contient un emplacement `<slot name="tete" />` pour les scripts d'avant affichage (Task 6).
- Produces: variables CSS sur `:root` : `--fond`, `--encre`, `--encre-douce`, `--filet`, `--palette-1` … `--palette-6`, `--taille-phrase` (`1.3125rem` = 21 px), `--taille-mot-cle` (`2rem`), `--interligne` (`1.5`), `--esp-lettres` (`0.05em`), `--esp-mots` (`0.16em`), `--largeur-lecture` (`40rem`).
- Produces: scripts pnpm `dev`, `apercu`, `build`, `preview`, `test`, `e2e`, `valider` (ajouté en Task 3), `check`.

- [ ] **Step 1 : Écrire le test de `lien`**

```ts
// src/lib/lien.test.ts — BASE_URL vaut '/cours/' (vitest.config.ts : define ou env)
it('préfixe la base', () => expect(lien('/6e/')).toBe('/cours/6e/'));
it('accepte un chemin sans barre initiale', () => expect(lien('6e/histoire/')).toBe('/cours/6e/histoire/'));
it('racine', () => expect(lien('/')).toBe('/cours/'));
```

- [ ] **Step 2 : `pnpm install` puis `pnpm test` → échoue (module absent)**
- [ ] **Step 3 : Implémenter `lien` dans `src/lib/lien.ts`, les configurations, `Base.astro`, `global.css` (valeurs des Global Constraints, `@font-face` locaux, `font-display: swap`), et une page d'accueil provisoire « Cours » qui utilise `Base`**

`playwright.config.ts` : reprendre le modèle de `C:\code\capsicum\apps\web\playwright.config.ts` (serveur `pnpm preview --host 127.0.0.1 --port 4321 --ignore-lock`, URL d'attente `http://127.0.0.1:4321/cours/`, `locale: 'fr-FR'`, projet chromium en 390 × 844).
`AGENTS.md` : contrat commun Claude/Codex — documents d'autorité (spec, recherche, TODO.md, plans), règle vie privée (Global Constraints, premier point, mot pour mot), commandes de contrôle (`pnpm check && pnpm test && pnpm valider && pnpm build && pnpm e2e`), règle « aucun texte dans une image », `git add` explicite, langue française. `CLAUDE.md` renvoie à `AGENTS.md` en quelques lignes. `README.md` : ce qu'est le site, lancer, aperçu sur téléphone (`pnpm apercu`).
- [ ] **Step 4 : Écrire `e2e/socle.spec.ts`**

```ts
test('accueil servi sous /cours/', async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  const ff = await page.locator('body').evaluate(e => getComputedStyle(e).fontFamily);
  expect(ff).toContain('Luciole');
  expect(await new AxeBuilder({ page }).analyze().then(r => r.violations)).toEqual([]);
});
test('zoom non bloqué', async ({ page }) => {
  await page.goto('/cours/');
  const vp = await page.locator('meta[name=viewport]').getAttribute('content');
  expect(vp).not.toMatch(/maximum-scale|user-scalable/);
});
```

- [ ] **Step 5 : `pnpm test && pnpm build && pnpm e2e` → tout passe**
- [ ] **Step 6 : Commit** — `git add` des fichiers listés ; message « Socle Astro, styles de lecture et contrat des agents »

### Task 2 : Garde-fou vie privée avant chaque commit

**Files:**
- Create: `scripts/verifier-prive.mjs`, `scripts/mots-interdits.mjs`, `.githooks/pre-commit`, `.githooks/commit-msg`
- Create (non versionné) : `prive/mots-interdits.txt`, amorcé par l'agent avec les termes personnels relevés dans `prive/contexte.md` (liens de parenté, résultats de tests) ; l'auteur y ajoutera prénoms et noms. Le contenu de ce fichier ne doit jamais apparaître dans un fichier versionné, tests compris
- Modify: `package.json` (script `prepare`: `git config core.hooksPath .githooks`), `AGENTS.md` (une ligne qui décrit le garde-fou)
- Test: `scripts/mots-interdits.test.mjs`

**Interfaces:**
- Produces: `chargerMotifs(texte: string): RegExp[]` — une ligne = un motif ; lignes vides et lignes commençant par `#` ignorées ; motif insensible à la casse ; une ligne sans métacaractère est échappée et entourée de `\b`.
- Produces: `trouverMotsInterdits(texte: string, motifs: RegExp[]): { ligne: number; extrait: string }[]`.
- Produces: `node scripts/verifier-prive.mjs --index` (fichiers indexés, `git diff --cached --name-only --diff-filter=ACM`), `node scripts/verifier-prive.mjs --message <fichier>` et `node scripts/verifier-prive.mjs --stdin` (texte lu sur l'entrée standard, signalé par numéro de ligne) ; sortie 1 avec `chemin:ligne` (sans répéter le mot trouvé) si un motif apparaît ; sortie 0 avec un avertissement si `prive/mots-interdits.txt` n'existe pas (CI, autre machine).

- [ ] **Step 1 : Écrire les tests**

```js
const m = chargerMotifs('# commentaire\nmot secret\n\n\\bXZ\\b');
expect(m).toHaveLength(2);
expect(trouverMotsInterdits('ligne 1\nUn Mot Secret ici', m)).toEqual([{ ligne: 2, extrait: 'Un Mot Secret ici' }]);
expect(trouverMotsInterdits('un xzylophone', m)).toEqual([]);   // \bXZ\b n'attrape pas un mot plus long
expect(trouverMotsInterdits('le code XZ', m)).toHaveLength(1);
```

- [ ] **Step 2 : `pnpm test` → échoue**
- [ ] **Step 3 : Implémenter les deux scripts et les deux crochets** (`pre-commit` appelle `--index`, `commit-msg` appelle `--message "$1"`)
- [ ] **Step 4 : `pnpm test` → passe ; vérification manuelle : créer un fichier jetable contenant le premier terme de `prive/mots-interdits.txt`, `git add` puis `git commit` → refusé avec `chemin:1` ; retirer le fichier de l'index et le supprimer**
- [ ] **Step 5 : Commit** — message « Garde-fou : refuser un commit qui contient un détail personnel »

### Task 3 : Modèle de leçon, validation et avertissements

**Files:**
- Create: `src/lecon/niveaux.ts`, `src/lecon/schema.ts`, `src/lecon/avertissements.ts`, `src/lecon/visibilite.ts`, `src/lecon/catalogue.ts`, `src/content.config.ts`, `scripts/valider.ts`
- Create: `e2e/contenu-test/` (leçons d'essai, voir Step 5)
- Modify: `package.json` (dépendance `yaml`, script `valider`: `node scripts/valider.ts`)
- Test: `src/lecon/schema.test.ts`, `src/lecon/avertissements.test.ts`, `src/lecon/catalogue.test.ts`

**Interfaces:**
- Produces (`niveaux.ts`) : `NIVEAUX: readonly { id: NiveauId; libelle: string; cycle: 'college' | 'lycee' | 'superieur' }[]` dans l'ordre `6e, 5e, 4e, 3e, 2de, 1re, tle, sup` (libellés « 6e », « 5e », « 4e », « 3e », « 2de », « 1re », « Terminale », « Supérieur ») ; `type NiveauId`.
- Produces (`schema.ts`) : `leconSchema` (Zod) et `type Lecon = z.infer<typeof leconSchema>` :

```ts
lecon = {
  titre: string (non vide), niveau: NiveauId, matiere: slug (/^[a-z0-9-]+$/), matiereLibelle: string,
  ordre: number (entier ≥ 1), langue: 'fr' | 'en' (défaut 'fr'), statut: 'brouillon' | 'publie',
  resume?: string, sources: { libelle: string; url?: string (url) }[] (au moins 1),
  chapitres: Chapitre[] (au moins 1),
}
Chapitre = { titre: string, cartes: Carte[] (au moins 1), ensemble?: Ensemble, formule?: string, questions?: { question: string; reponse: string; image?: Image }[] }
Carte = { picto?: string (/^[a-z0-9-]+$/), motCle?: string, phrases?: string[], points?: string[], formule?: string,
          enSavoirPlus?: string, notes?: string, image?: Image }
        // refine : au moins un de image, motCle, phrases, points, formule
Image = { fichier: string; alt: string (non vide); credit: 'generee' | { auteur: string; licence: string; url: string }; etiquettes?: Etiquette[] }
      | { aGenerer: string (non vide); alt: string (non vide); etiquettes?: Etiquette[] }
Etiquette = { texte: string; x: number (0-100); y: number (0-100) }   // pourcentages
Ensemble = { type: 'mosaique' } | { type: 'frise'; periodes: { libelle: string; dates: string; carte?: number (entier ≥ 1) }[] (au moins 2) }
```

  `superRefine` au niveau leçon : si `statut === 'publie'`, toute `Image` de type `aGenerer` est une erreur dont le message contient `image à générer` et le chemin (chapitre, carte) ; une `periodes[].carte` doit désigner une carte existante du chapitre.
- Produces (`avertissements.ts`) : `OBJECTIFS: Record<'college' | 'lycee' | 'superieur', { cartesMin: number; cartesMax: number; motsParPhraseMax?: number; phrasesMax?: number }>` = collège `{6, 12, motsParPhraseMax: 20, phrasesMax: 1}`, lycée `{10, 20, phrasesMax: 2}`, supérieur `{15, 30}` ; `avertissements(lecon: Lecon): string[]` — un message en français par dépassement (cartes d'un chapitre hors objectif, phrase trop longue, trop de phrases, titre de plus de 6 mots), chaque message commence par `<titre du chapitre> :` ou `Titre :`.
- Produces (`visibilite.ts`) : `estVisible(statut: Lecon['statut'], apercu: boolean): boolean` ; `modeApercu(): boolean` = `import.meta.env.DEV || process.env.APERCU === '1'`.
- Produces (`catalogue.ts`), fonctions pures sur `{ id: string; data: Lecon }[]` déjà filtrées : `niveauxPresents(lecons)` → `NIVEAUX` filtrés dans l'ordre ; `matieresDuNiveau(lecons, niveau)` → `{ matiere, matiereLibelle }[]` triées par libellé ; `leconsDeMatiere(lecons, niveau, matiere)` → triées par `ordre` puis `titre` ; `slugLecon(id)` → dernier segment du dossier (`6e/histoire/paleolithique/lecon` → `paleolithique`).
- Produces (`content.config.ts`) : collection `lecons`, `glob({ pattern: '**/lecon.yaml', base: process.env.CONTENU_DIR ?? './contenu' })`, schéma `leconSchema`.
- Produces : `pnpm valider` — lit tous les `lecon.yaml` sous `CONTENU_DIR` (défaut `contenu`), affiche erreurs puis avertissements par fichier, vérifie que chaque `image.fichier` existe dans le dossier de la leçon et que chaque `picto` existe dans `public/pictos/<nom>.svg` ; sortie 1 s'il y a au moins une erreur, 0 sinon (les avertissements ne bloquent jamais).

- [ ] **Step 1 : Écrire les tests du schéma**

```ts
const base = { titre: 'Vivre au Paléolithique', niveau: '6e', matiere: 'histoire', matiereLibelle: 'Histoire',
  ordre: 1, statut: 'brouillon', sources: [{ libelle: 'Programme de 6e' }],
  chapitres: [{ titre: 'Chasse', cartes: [{ motCle: 'chasser', image: { aGenerer: 'chasseurs et rennes', alt: 'Des chasseurs' } }] }] };
it('accepte un brouillon avec image à générer', () => expect(leconSchema.safeParse(base).success).toBe(true));
it('refuse une leçon publiée avec image à générer', () => {
  const r = leconSchema.safeParse({ ...base, statut: 'publie' });
  expect(r.success).toBe(false); expect(JSON.stringify(r.error)).toContain('image à générer'); });
it('refuse une carte vide', () => expect(leconSchema.safeParse({ ...base, chapitres: [{ titre: 'x', cartes: [{}] }] }).success).toBe(false));
const avecImage = (etiquettes) => ({ ...base, chapitres: [{ titre: 'c', cartes: [{ motCle: 'm', image: { aGenerer: 'd', alt: 'a', etiquettes } }] }] });
it('refuse une étiquette hors image', () => expect(leconSchema.safeParse(avecImage([{ texte: 't', x: 120, y: 10 }])).success).toBe(false));
it('refuse une frise qui vise une carte inexistante', () => expect(leconSchema.safeParse({ ...base, chapitres: [{ ...base.chapitres[0],
  ensemble: { type: 'frise', periodes: [{ libelle: 'a', dates: 'x', carte: 9 }, { libelle: 'b', dates: 'y' }] } }] }).success).toBe(false));
it('langue par défaut fr', () => expect(leconSchema.parse(base).langue).toBe('fr'));
```

- [ ] **Step 2 : Écrire les tests des avertissements et du catalogue**

```ts
expect(avertissements(leconAvec(3 /* cartes */, '6e'))).toContainEqual(expect.stringContaining('3 cartes'));
expect(avertissements(leconAvec(8, '6e'))).toEqual([]);
expect(avertissements(leconAvecPhrase('un deux … vingt-et-un mots', '6e'))[0]).toMatch(/21 mots/);
expect(avertissements(leconAvec(8, 'sup'))).toContainEqual(expect.stringContaining('8 cartes'));
expect(estVisible('brouillon', false)).toBe(false); expect(estVisible('brouillon', true)).toBe(true);
expect(niveauxPresents([l('sup'), l('6e')]).map(n => n.id)).toEqual(['6e', 'sup']);
expect(leconsDeMatiere([l('6e','histoire',2,'B'), l('6e','histoire',1,'Z')], '6e', 'histoire').map(x => x.data.ordre)).toEqual([1, 2]);
```

- [ ] **Step 3 : `pnpm test` → échoue**
- [ ] **Step 4 : Implémenter les cinq modules, `content.config.ts` et `scripts/valider.ts`**
- [ ] **Step 5 : Créer les leçons d'essai dans `e2e/contenu-test/`** (servent aux e2e des tâches suivantes) :
  - `6e/histoire/essai-publie/lecon.yaml` : publiée, 2 chapitres, une carte avec le mot-clé `anthropologiquement` (débordement), une image réelle `essai.webp` (crédit `generee`) avec deux étiquettes, une frise de 3 périodes, une formule, 2 questions ;
  - `6e/histoire/essai-brouillon/lecon.yaml` : brouillon, image `aGenerer` ;
  - `5e/geographie/seul-brouillon/lecon.yaml` : brouillon (le niveau 5e ne doit pas apparaître hors aperçu) ;
  - `sup/data-sciences/essai-anglais/lecon.yaml` : publiée, `langue: en`.
  - `e2e/contenu-test/6e/histoire/essai-publie/essai.webp` : petite image neutre sans texte (générée par script, 800 × 600, aplat dégradé).
- [ ] **Step 6 : `pnpm test` passe ; `CONTENU_DIR=e2e/contenu-test pnpm valider` → sortie 0, au moins un avertissement affiché (chapitres de moins de 6 cartes) ; une copie temporaire de `essai-brouillon` passée à `publie` → sortie 1 avec `image à générer` (copie supprimée ensuite)**
- [ ] **Step 7 : Commit** — message « Modèle de leçon : schéma, validation et avertissements par niveau »

### Task 4 : Navigation niveau → matière → leçon, brouillons et dernier niveau

**Files:**
- Create: `src/pages/index.astro` (remplace la page provisoire), `src/pages/[niveau]/index.astro`, `src/pages/[niveau]/[matiere]/index.astro`, `src/lib/lecons.ts`, `src/components/FilAriane.astro`, `src/scripts/dernier-niveau.ts`
- Modify: `package.json` (`build:essai`: `CONTENU_DIR=e2e/contenu-test astro build` ; `apercu`: `APERCU=1 astro dev --host`), `playwright.config.ts` (construire avec `CONTENU_DIR=e2e/contenu-test` avant `preview`)
- Test: `e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: `estVisible`, `modeApercu`, `niveauxPresents`, `matieresDuNiveau`, `leconsDeMatiere`, `slugLecon`, `NIVEAUX`, `lien`.
- Produces: `leconsVisibles(): Promise<{ id: string; data: Lecon }[]>` dans `src/lib/lecons.ts` (`getCollection('lecons')` filtrée par `estVisible(statut, modeApercu())`) — seule porte d'accès aux leçons pour toutes les pages.
- Produces: adresses `/cours/<niveau>/`, `/cours/<niveau>/<matiere>/`, `/cours/<niveau>/<matiere>/<lecon>/` (cette dernière en Task 5).
- Produces: clé de stockage `cours-niveau` (id du niveau) ; écrite par la page d'un niveau ; lue par l'accueil, qui redirige (`location.replace`) vers ce niveau s'il figure dans la liste affichée, **sauf** si l'adresse contient `?choisir` ; chaque page de niveau a un lien « Changer de niveau » vers `/cours/?choisir`. Toute lecture ou écriture du stockage est dans un `try/catch`.

- [ ] **Step 1 : Écrire `e2e/navigation.spec.ts`**

```ts
test('accueil : seuls les niveaux publiés', async ({ page }) => {
  await page.goto('/cours/?choisir');
  await expect(page.getByRole('link', { name: '6e' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Supérieur' })).toBeVisible();
  await expect(page.getByRole('link', { name: '5e' })).toHaveCount(0);           // seulement un brouillon
});
test('niveau → matière → leçon', async ({ page }) => {
  await page.goto('/cours/?choisir'); await page.getByRole('link', { name: '6e' }).click();
  await expect(page).toHaveURL(/\/cours\/6e\/$/);
  await page.getByRole('link', { name: 'Histoire' }).click();
  await expect(page.getByRole('link', { name: /essai-brouillon|Essai brouillon/ })).toHaveCount(0);
});
test('brouillon absent du site construit', async ({ request }) => {
  expect((await request.get('/cours/6e/histoire/essai-brouillon/')).status()).toBe(404);
});
test('retour direct au dernier niveau', async ({ page }) => {
  await page.goto('/cours/6e/'); await page.goto('/cours/');
  await expect(page).toHaveURL(/\/cours\/6e\/$/);
  await page.goto('/cours/?choisir'); await expect(page).toHaveURL(/\?choisir$/);
});
test('stockage bloqué : l\'accueil reste utilisable', async ({ browser }) => {
  const ctx = await browser.newContext(); await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('bloqué'); } }); });
  const page = await ctx.newPage(); await page.goto('/cours/');
  await expect(page.getByRole('link', { name: '6e' })).toBeVisible();
});
```

- [ ] **Step 2 : `pnpm build:essai && pnpm e2e navigation` → échoue**
- [ ] **Step 3 : Implémenter les pages, `lecons.ts`, le fil d'Ariane et `dernier-niveau.ts`** (les cartes de niveau et de matière sont de grands blocs ≥ 48 px de haut, un par ligne au téléphone ; aucune page « Bientôt » ; si aucune leçon n'est publiée, l'accueil affiche « Aucun cours publié pour l'instant. »)
- [ ] **Step 4 : `pnpm e2e navigation` → passe ; axe sans violation sur les trois pages (ajouter l'assertion à chaque test de page)**
- [ ] **Step 5 : Commit** — message « Navigation par niveau et matière, brouillons exclus, retour au dernier niveau »

### Task 5 : La fiche « une idée par carte »

**Files:**
- Create: `src/pages/[niveau]/[matiere]/[lecon]/index.astro`, `src/components/Fiche.astro`, `src/components/Carte.astro`, `src/components/ImageCarte.astro`, `src/components/Frise.astro`, `src/components/Mosaique.astro`, `src/components/Questions.astro`, `src/components/Picto.astro`, `src/lib/images.ts`, `src/scripts/questions.ts`
- Create: `public/pictos/` (pictos utilisés par les leçons d'essai et la leçon pilote, SVG 24 × 24, `fill="currentColor"`, sans texte)
- Test: `e2e/fiche.spec.ts`

**Interfaces:**
- Consumes: `Lecon`, `leconsVisibles`, `slugLecon`, `lien`, `Base` (avec `langue = lecon.langue`).
- Produces: `resoudreImage(idLecon: string, fichier: string): ImageMetadata` dans `src/lib/images.ts` (via `import.meta.glob` eager sur `${CONTENU_DIR}/**/*.{webp,png,jpg,jpeg}` ; erreur explicite si absente) ; rendu par `<Image>` d'`astro:assets`, largeur 1600, `sizes` adaptés à `--largeur-lecture`.
- Produces: structure DOM sur laquelle s'appuient les Tasks 6 et le plan 3 : chaque carte est `<article class="carte" data-texte="<mot-clé>. <phrases>">` ; le compteur est `<p class="compteur">3 / 7</p>` (numérotation par chapitre) ; les questions sont dans `<section class="questions">`.
- Rendu d'une carte, dans cet ordre : image (ou, pour `aGenerer` en aperçu, un cadre 4:3 « Image à générer » + la description) ; étiquettes posées en `position: absolute` à `left: x%`, `top: y%`, fond opaque, texte ≥ 18 px ; mention « Image générée » en bas à droite (14 px) si `credit: generee`, sinon `auteur — licence` en lien ; puis pastille numéro + picto + mot-clé ; phrases ; points (liste) ; formule ; `enSavoirPlus` dans `<details>` « En savoir plus ». Les `notes` ne sont **jamais** rendues dans la fiche.
- Couleur d'une carte : `--palette-((rang-1) mod 6)+1`, appliquée à la pastille et au filet, jamais au texte de lecture.
- Chapitre : titre, cartes, carte d'ensemble (`frise` : périodes empilées verticalement au téléphone, chaque période avec son libellé, ses dates et, si `carte` est donnée, la pastille de cette carte ; `mosaique` : vignettes des cartes du chapitre avec leur mot-clé, deux colonnes au-delà de 768 px ; sans `ensemble` : mosaïque), formule en très grand, puis « Questions qui peuvent tomber ».
- Questions : réponses visibles par défaut ; un bouton « Cacher les réponses » (`aria-pressed`) masque toutes les réponses et fait apparaître sous chaque question un bouton « Voir la réponse » ; rien n'est enregistré.
- En-tête de leçon : titre, niveau et matière, sources listées en bas de page.

- [ ] **Step 1 : Écrire `e2e/fiche.spec.ts`**

```ts
const url = '/cours/6e/histoire/essai-publie/';
test('cartes, compteur, image générée', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('article.carte').first().locator('.compteur')).toHaveText(/^1 \/ \d+$/);
  await expect(page.getByText('Image générée').first()).toBeVisible();
  await expect(page.getByText('anthropologiquement')).toBeVisible();
  expect(await new AxeBuilder({ page }).analyze().then(r => r.violations)).toEqual([]);
});
for (const largeur of [320, 375, 390, 768, 1280]) test(`pas de défilement horizontal à ${largeur}px`, async ({ page }) => {
  await page.setViewportSize({ width: largeur, height: 800 }); await page.goto(url);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('typographie de lecture', async ({ page }) => {
  await page.goto(url);
  const p = page.locator('article.carte p.phrase').first();
  expect(parseFloat(await p.evaluate(e => getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(20);
  expect(await p.evaluate(e => getComputedStyle(e).textAlign)).not.toBe('justify');
  expect(await page.locator('main *').evaluateAll(es => es.some(e => getComputedStyle(e).fontStyle === 'italic'))).toBe(false);
  expect(await page.locator('.mot-cle').first().evaluate(e => getComputedStyle(e).textTransform)).toBe('none');
});
test('notes de l\'orateur jamais affichées', async ({ page }) => {
  await page.goto(url); await expect(page.getByText('NOTE-ORATEUR-ESSAI')).toHaveCount(0);  // présente dans le YAML d'essai
});
test('frise et questions', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('.frise li')).toHaveCount(3);
  const reponse = page.locator('.questions .reponse').first(); await expect(reponse).toBeVisible();
  await page.getByRole('button', { name: 'Cacher les réponses' }).click();
  await expect(reponse).toBeHidden();
  await page.getByRole('button', { name: 'Voir la réponse' }).first().click();
  await expect(reponse).toBeVisible();
});
test('leçon en anglais', async ({ page }) => {
  await page.goto('/cours/sup/data-sciences/essai-anglais/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
```

- [ ] **Step 2 : `pnpm build:essai && pnpm e2e fiche` → échoue**
- [ ] **Step 3 : Implémenter la page de leçon et les composants** (ajouter `notes: NOTE-ORATEUR-ESSAI` à une carte du YAML d'essai)
- [ ] **Step 4 : `pnpm e2e` (toutes les suites) → passe ; capture à 390 px de `essai-publie` regardée et jointe au rapport de tâche**
- [ ] **Step 5 : Commit** — message « Fiche défilante : cartes, frise, mosaïque, formule et questions »

### Task 6 : Écouter et réglages de lecture

**Files:**
- Create: `src/components/Ecouter.astro`, `src/scripts/ecouter.ts`, `src/components/Reglages.astro`, `src/scripts/reglages.ts`, `src/scripts/reglages-avant-affichage.ts` (en ligne dans `<head>` via le slot `tete`)
- Modify: `src/components/Carte.astro` (bouton écouter), `src/layouts/Base.astro` (panneau réglages accessible depuis chaque page), `src/styles/global.css` (variantes)
- Test: `e2e/aides.spec.ts`

**Interfaces:**
- Consumes: `article.carte[data-texte]`, `lang` de `<html>`.
- Produces: bouton « Écouter » (≥ 48 px, icône SVG + mot) par carte ; lit `data-texte` avec `speechSynthesis`, `utterance.lang = 'fr-FR'` ou `'en-GB'` selon `<html lang>`, `rate` = réglage ; un second appui arrête ; si `'speechSynthesis' in window` est faux, aucun bouton n'est inséré (les boutons sont ajoutés par le script, absents du HTML).
- Produces: réglages stockés sous la clé `cours-reglages` = `{ taille: 'normale' | 'grande' | 'tres-grande'; espacement: 'normal' | 'aere'; fond: 'creme' | 'blanc'; vitesse: 0.8 | 1 | 1.2 }` ; appliqués avant l'affichage comme attributs `data-taille`, `data-espacement`, `data-fond` sur `<html>` ; `taille` multiplie la taille racine par 1 / 1,15 / 1,3 ; `aere` applique les valeurs « aéré » des Global Constraints. Stockage absent ou illisible → valeurs par défaut, sans erreur.

- [ ] **Step 1 : Écrire `e2e/aides.spec.ts`**

```ts
const url = '/cours/6e/histoire/essai-publie/';
test('réglages appliqués et retenus', async ({ page }) => {
  await page.goto(url); await page.getByRole('button', { name: 'Réglages' }).click();
  await page.getByRole('radio', { name: 'Aéré' }).check();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-espacement', 'aere');
});
test('écouter lit le texte de la carte', async ({ page }) => {
  await page.addInitScript(() => { (window as any).__lu = []; window.speechSynthesis.speak = (u: any) => (window as any).__lu.push([u.text, u.lang]); });
  await page.goto(url); await page.getByRole('button', { name: 'Écouter' }).first().click();
  const [[texte, langue]] = await page.evaluate(() => (window as any).__lu);
  expect(texte).toContain('anthropologiquement'); expect(langue).toBe('fr-FR');
});
test('sans synthèse vocale : pas de bouton', async ({ page }) => {
  await page.addInitScript(() => { delete (window as any).speechSynthesis; });
  await page.goto(url); await expect(page.getByRole('button', { name: 'Écouter' })).toHaveCount(0);
});
test('stockage bloqué : la fiche s\'affiche', async ({ browser }) => {
  /* même addInitScript que Task 4 */ await expect(page.locator('article.carte').first()).toBeVisible();
});
```

- [ ] **Step 2 : `pnpm e2e aides` → échoue**
- [ ] **Step 3 : Implémenter**
- [ ] **Step 4 : `pnpm e2e` → tout passe**
- [ ] **Step 5 : Commit** — message « Écouter chaque carte et réglages de lecture retenus »

### Task 7 : Leçon pilote « Paléolithique » (brouillon)

Tâche de contenu : aucun code. L'agent qui l'exécute lit `AGENTS.md`, la spec § 4-7 et la recherche R § 12, puis les fiches de `sources/chatgpt-6e/` (en particulier « Vivre au Paléolithique », « Pincevent », « Art et croyances au Paléolithique », « Les premiers humains », « Homo sapiens peuple le monde ») **comme sources de savoir et de style, sans recopier leur texte**.

**Files:**
- Create: `contenu/6e/histoire/paleolithique/lecon.yaml`
- Create: `public/pictos/*.svg` manquants (même format qu'en Task 5)

**Exigences:**
- `statut: brouillon`, `niveau: 6e`, `matiere: histoire`, `matiereLibelle: Histoire`, `langue: fr`.
- Notions et vocabulaire alignés sur le programme d'histoire de 6e (thème 1, « La longue histoire de l'humanité et des migrations » : les débuts de l'humanité) ; vérifier sur Eduscol / le Bulletin officiel et citer ces pages dans `sources` avec leur URL.
- Découpage en chapitres selon les objectifs collège (6 à 12 cartes par chapitre) ; mot-clé en minuscules ; une phrase de 20 mots au plus par carte ; chaque chapitre avec une carte d'ensemble (au moins une `frise`) et 2 à 4 questions qui peuvent tomber.
- Toutes les images en `aGenerer` : description autonome et précise de ce que l'image doit **montrer** (sujet, action, époque, lieu, ce qui ne doit pas y figurer), photoréaliste, **sans aucun texte** ; `alt` rédigé. Elles seront produites au plan 2.
- Aucun anachronisme ; aucune donnée personnelle.

- [ ] **Step 1 : Rédiger `lecon.yaml`**
- [ ] **Step 2 : `pnpm valider` → sortie 0 ; noter les avertissements et les corriger sauf choix justifié**
- [ ] **Step 3 : Vérification par un agent distinct** : relire chaque fait contre les sources citées et le programme, l'orthographe de chaque mot-clé, la conformité aux règles de la spec § 5 ; corrections appliquées
- [ ] **Step 4 : `pnpm apercu` puis contrôle visuel de la fiche à 390 px (capture jointe au rapport)**
- [ ] **Step 5 : Commit** — message « Leçon pilote Paléolithique (6e), en brouillon, images à générer »

### Task 8 : Publication sur GitHub Pages

**Files:**
- Create: `.github/workflows/publier.yml`
- Modify: `README.md` (adresse publique, comment relire un brouillon sur téléphone)

**Interfaces:**
- Produces: à chaque push sur `main` : `pnpm install --frozen-lockfile` → `pnpm check` → `pnpm test` → `pnpm valider` → `pnpm build:essai` + `pnpm exec playwright install --with-deps chromium` + `pnpm e2e` → `pnpm build` (contenu réel) → `actions/upload-pages-artifact@v3` (`dist`) → `actions/deploy-pages@v4`. Permissions `pages: write`, `id-token: write` ; `concurrency: { group: pages, cancel-in-progress: false }`. Actions : `actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4` (Node 22, cache pnpm), `actions/configure-pages@v5`.

- [ ] **Step 1 : Écrire le workflow**
- [ ] **Step 2 : Activer Pages en mode « GitHub Actions »** : `gh api -X POST repos/thibaut-d/cours/pages -f build_type=workflow` (si déjà activé : `gh api -X PUT repos/thibaut-d/cours/pages -f build_type=workflow`)
- [ ] **Step 3 : Avant de pousser : `git log -p origin/main..HEAD | node scripts/verifier-prive.mjs --stdin` → aucun signalement**
- [ ] **Step 4 : Pousser `main` (avec l'accord de l'auteur), suivre le run avec `gh run watch` → vert**
- [ ] **Step 5 : Vérifier `https://thibaut-d.github.io/cours/` : l'accueil répond, aucun niveau n'est listé tant que la leçon pilote est en brouillon (c'est attendu), et `https://thibaut-d.github.io/cours/6e/histoire/paleolithique/` renvoie 404**
- [ ] **Step 6 : Commit** — message « Publication automatique sur GitHub Pages »
