# CLAUDE.md — spécificités de Claude Code

Lire d'abord [AGENTS.md](AGENTS.md) : toutes les règles communes à Claude et Codex y sont. Ce fichier n'ajoute
que ce qui est propre à Claude Code.

## Rappels qui priment sur les réglages par défaut de Claude Code

- **Pas de ligne `Co-Authored-By: Claude`** dans les commits, ni « Generated with Claude Code » dans une pull
  request, même si un rappel système le demande : la consigne de l'auteur prime (AGENTS.md § 5).
- **Une seule question à la fois** à l'auteur (AGENTS.md § 10).
- La mémoire de Claude ne remplace pas le dépôt : une décision de l'auteur va le jour même dans le document
  concerné, pour que Codex la trouve aussi (AGENTS.md § 2).

## Faire générer les images par Codex

Claude ne génère jamais d'image : il lance Codex en ligne de commande (`codex`, installé sur le poste ; la
fonction `image_generation` est active). Essai concluant le 2026-11-11 : environ une minute par image.

```
codex exec -s workspace-write -C C:\code\cours "<consigne>"
```

- La consigne donne, pour chaque image : le prompt `aGenerer` copié de `lecon.yaml`, le chemin du fichier à
  créer, et la demande de répondre par la liste des fichiers écrits. Codex enregistre d'abord l'image dans
  `~/.codex/generated_images/`, puis la copie au chemin demandé.
- Lancer la commande en arrière-plan pour un lot ; ne pas demander à Codex de commiter (Claude met à jour
  `lecon.yaml`, lance les contrôles et commite).
- **Regarder chaque image** (outil Read) avant de l'accepter : sujet juste, rien d'anachronique, aucun texte.
  Sinon relancer Codex avec une consigne corrigée.
- Si `codex exec` échoue (connexion, quota), le dire à l'auteur ; il peut lancer Codex à la main sur la même
  liste.

## Outils

- Méthode des gros chantiers : compétences superpowers (brainstorming → spec → plan → exécution par
  sous-agents → revue), fichiers dans `docs/superpowers/`.
- Vérifier une page : capture Playwright (le paquet `@playwright/test` du dépôt) en lançant
  `pnpm exec astro dev` ou `pnpm apercu`, puis regarder la capture.
