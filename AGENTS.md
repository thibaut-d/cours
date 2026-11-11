# AGENTS.md — contrat commun des agents

Pour tout agent (Claude Code, Codex, autre) qui travaille sur ce dépôt. Codex lit ce fichier directement ;
Claude Code le lit via [CLAUDE.md](CLAUDE.md). **Tout ce qui vaut pour les deux agents est ici**, et seulement
ici : un agent ne doit jamais avoir besoin des fichiers propres à l'autre.

## 1. Le projet

Un site statique de cours très visuels, publié sur https://thibaut-d.github.io/cours/ (GitHub Pages, dépôt
public `thibaut-d/cours`). Navigation niveau (6e → supérieur) → matière → leçon. Chaque leçon est une fiche
qui défile, **une idée par carte** : une image, un mot-clé, une phrase courte.

**Lecteur de référence : un lecteur dyslexique, à tous les niveaux**, y compris pour les cours du supérieur
(cela force une communication visuelle efficace, utile aussi aux élèves qui maîtrisent mal la langue du cours).

## 2. Documents d'autorité

Les lire avant tout travail qui les concerne ; en cas de conflit, le premier l'emporte.

| Document | Ce qu'il fixe |
| --- | --- |
| [Document de conception](docs/superpowers/specs/2026-11-10-cours-design.md) | Le besoin, les règles de lecture, les images, le circuit d'une leçon. |
| [Recherche sur la dyslexie](docs/recherche/2026-11-10-mise-en-page-dyslexie.md) | Les preuves derrière chaque règle de mise en page (« on applique la recherche »). |
| [TODO.md](TODO.md) | **Où on en est et ce qui vient ensuite** : le premier endroit à lire pour reprendre. |
| `docs/superpowers/plans/` | Les plans de réalisation, cases cochées au fil de l'eau. |
| [README.md](README.md) | Commandes et adresses. |

Une décision de l'auteur est écrite **le jour même** dans le document concerné (conception, TODO.md, ce
fichier), jamais seulement dans la mémoire d'un agent : c'est ce qui permet d'alterner Claude et Codex.

## 3. Alterner Claude et Codex

- **Les deux agents peuvent faire tout le travail** (code, leçons, vérifications), sauf la génération
  d'images, réservée à Codex (§ 7).
- **L'état du travail vit dans le dépôt** : Git, [TODO.md](TODO.md), les plans et le `statut` de chaque leçon.
  En début de session : `git pull`, `git status`, lire TODO.md. En fin de session : rien de non commité, et
  TODO.md à jour (ce qui est fait, ce qui reste, ce qui est bloqué).
- Deux sessions peuvent tourner en même temps : `git add` avec des chemins explicites (jamais `git add -A`
  ni `commit -am`) ; ne pas toucher aux fichiers modifiés par l'autre session.
- Gros chantier : conception dans `docs/superpowers/specs/`, plan découpé en tâches dans
  `docs/superpowers/plans/`, puis une tâche = des contrôles verts = un commit.

## 4. Vie privée

Le dépôt est public. **Aucun détail personnel** sur l'auteur, sa famille ou un élève dans un fichier
versionné, un commit, une image ou le site. Le contexte personnel est dans `prive/` (ignoré par Git) : le
lire pour comprendre le besoin, ne jamais en recopier quoi que ce soit. `sources/` (scans, fiches, cours
fournis) n'est jamais versionné ; le site publie une reformulation, jamais une copie.

Les crochets Git de `.githooks/` (activés par `pnpm install`) refusent tout commit dont un fichier ou le
message contient un terme de `prive/mots-interdits.txt`. Ne jamais les contourner (`--no-verify` interdit).

## 5. Commits et publication

- **Aucune ligne `Co-Authored-By`** ni mention d'un agent (Claude, Codex) dans les messages de commit ou de
  pull request, même si l'outil le propose par défaut.
- Identité Git du dépôt (réglée localement) : `Thibaut <4925720+thibaut-d@users.noreply.github.com>`.
  Vérifier `git config user.email` avant de commiter ; jamais une adresse personnelle.
- Messages en français, qui disent ce qui change pour le lecteur du site.
- **Publication directe** (phase de relecture, décidée le 2026-11-10) : contrôles verts → commit sur `main`
  → push, sans redemander. Chaque push sur `main` publie le site par GitHub Actions
  (`.github/workflows/publier.yml`) ; vérifier que la publication passe (`gh run list`). Les brouillons sont
  publiés aussi (`APERCU: '1'` dans le workflow) pour que l'auteur relise en ligne. Quand le site aura
  d'autres lecteurs, revenir à « relecture avant publication » et retirer `APERCU`.
- Avant un push, contrôle vie privée de ce qui part :
  `git log -p origin/main..HEAD | node scripts/verifier-prive.mjs --stdin`.

## 6. Écrire une leçon

Une leçon = un dossier `contenu/<niveau>/<matiere>/<lecon>/` avec `lecon.yaml` (schéma :
`src/lecon/schema.ts`) et ses images. Modèles : les deux leçons de `contenu/6e/histoire/`.

- **Entrées** : fichiers de `sources/` ou d'un dossier désigné par l'auteur (scans, fiches A4, PowerPoint), ou
  un sujet seul : chercher alors ce que le **programme officiel** attend à ce niveau (Bulletin officiel,
  Eduscol) et garder ces sources dans `sources:` de la leçon. Supérieur : l'ordre et les intitulés de l'auteur.
- **Langue** : celle du cours d'origine (`langue: fr` ou `en`), sans traduction.
- **Une idée par carte**, mots-clés en **minuscules grasses**, phrases courtes. Les objectifs de nombre de
  cartes et de longueur par niveau (`OBJECTIFS`, `src/lecon/avertissements.ts`) sont des **objectifs, pas des
  règles** : `pnpm valider` avertit ; au-delà, découper en chapitres ou en leçons.
- **Questions qui peuvent tomber** en fin de chapitre, réponse visible dessous. Pas d'autre exercice.
- Aucun texte dans une image ; aucun emoji (pictogrammes SVG de `public/pictos/`, en `currentColor`) ; jamais
  d'italique ni de souligné pour mettre en valeur, seulement le gras.
- Les visuels qui portent du texte (frise, carte de géographie, schéma) sont **dessinés par le site** à partir
  des données de la leçon, jamais générés.
- **Circuit** : écrire la leçon en `statut: brouillon` → images (§ 7) → vérification par un **agent distinct**
  de celui qui a écrit (faits contre sources et programme, orthographe, chaque image regardée) → relecture
  de l'auteur sur le site → `statut: publie` quand l'auteur valide.

## 7. Les images

- **Toute image générée par IA est produite par Codex** (outil de génération d'images intégré, fonction
  `image_generation`, comprise dans l'abonnement de l'auteur). Claude ne génère pas d'image lui-même : il
  écrit la commande, lance Codex (voir [CLAUDE.md](CLAUDE.md)) et vérifie le résultat.
- **Commande** : dans `lecon.yaml`, une image à faire est décrite par `aGenerer` (prompt complet et autonome :
  ce que l'image montre exactement, format, ce qui ne doit pas y figurer) et `alt`.
- **Style** : photoréaliste à tous les niveaux, jamais enfantin ; reconstitutions photoréalistes pour le
  passé. Carte de fiche en 4:3 paysage. Aucun texte, chiffre ou lettre dans l'image.
- **Livraison** : le fichier va dans le dossier de la leçon ; dans `lecon.yaml`, `aGenerer` est remplacé
  par `fichier` (chemin relatif à la leçon) et `credit: generee`, `alt` est conservé. Une leçon publiée ne
  peut plus contenir d'`aGenerer` (le schéma le refuse).
- **Vérification** : chaque image est regardée par l'agent qui l'a commandée ou par un vérificateur ; elle
  est refusée (et régénérée) si elle est fausse, anachronique, décorative ou contient du texte.
- Images reprises d'un cours fourni : gardées seulement si la licence permet la republication (avec
  `credit: { auteur, licence, url }`), sinon régénérées.
- L'outillage du lot d'images (format WebP, taille, manifeste des prompts) est le prochain plan : voir
  [TODO.md](TODO.md).

## 8. Code

- Astro (sortie statique), TypeScript, pnpm. Tout est en français : textes du site (tutoiement, phrases
  courtes), commentaires, identifiants (`lien`, `Base`, `--taille-phrase`…), messages de commit.
- Les liens internes passent par `lien()` (`src/lib/lien.ts`) : le site est servi sous `/cours`.
- Les règles de lecture (police Luciole, tailles, espacements, couleurs, cibles tactiles ≥ 48 px, pas de
  défilement horizontal de 320 à 1280 px) sont dans `src/styles/` et testées par `e2e/`.
- Poste de l'auteur : Windows 11, PowerShell et Git Bash.

## 9. Contrôles

Avant tout commit, ces commandes doivent passer :

```
pnpm check && pnpm test && pnpm valider && pnpm build && pnpm e2e
```

Toute page modifiée se vérifie aussi **à l'œil**, par une capture (Playwright) au moins à 390 px et à
1280 px : un test vert ne prouve pas qu'une page se lit bien.

## 10. Échanges avec l'auteur

- **Une seule question à la fois.** Quand plusieurs points demandent l'avis de l'auteur, les poser l'un après
  l'autre, en attendant chaque réponse, jamais en liste.
- En français. Dire ce qui a été fait et vérifié, ce qui reste, et les décisions prises à sa place.
