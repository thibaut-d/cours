# AGENTS.md — contrat commun des agents

Pour tout agent (Claude Code, Codex, autre) qui travaille sur ce dépôt. Les documents d'autorité sont le
[document de conception](docs/superpowers/specs/2026-11-10-cours-design.md), la
[recherche sur la dyslexie](docs/recherche/2026-11-10-mise-en-page-dyslexie.md), [TODO.md](TODO.md) et les
plans de `docs/superpowers/plans/`.

## Vie privée

Le dépôt est public. Aucun détail personnel sur l'auteur, sa famille ou un élève dans un fichier versionné, un commit ou le site. Le contexte personnel est dans `prive/` (ignoré par Git) ; ne jamais en recopier quoi que ce soit (spec § 7). `sources/` n'est jamais versionné. Les crochets Git de `.githooks/` (activés par `pnpm install`) refusent tout commit dont un fichier ou le message contient un terme de `prive/mots-interdits.txt` ; ne jamais les contourner.

## Commits

- **Aucune ligne `Co-Authored-By`** ni autre mention d'un agent (Claude, Codex) dans les messages de commit.
- L'identité Git du dépôt utilise l'adresse anonyme GitHub `4925720+thibaut-d@users.noreply.github.com`
  (réglée localement) ; jamais une adresse personnelle.
- Messages en français ; `git add` avec des chemins explicites.

## Langue et vocabulaire

Tout est en français : textes du site (tutoiement, phrases courtes), commentaires, identifiants du code
(`lien`, `Base`, `--taille-phrase`…) et messages de commit.

## Règles de contenu

- **Aucun texte dans une image** ; mention « Image générée » sur chaque image générée.
- Aucun emoji ; pictogrammes en SVG unis recolorables (`currentColor`).
- Jamais d'italique ni de souligné pour mettre en valeur : gras.

## Contrôles

Avant tout commit, ces commandes doivent passer :

```
pnpm check && pnpm test && pnpm valider && pnpm build && pnpm e2e
```

Les liens internes passent par `lien()` (`src/lib/lien.ts`) : le site est servi sous `/cours`.

## Échanges avec l'auteur

**Une seule question à la fois.** Quand plusieurs points demandent l'avis de l'auteur, les poser l'un après
l'autre, en attendant chaque réponse, jamais en liste.
