# cours

Site statique de cours illustrés, pensé pour une lecture facile (dyslexie) : phrases courtes, mots-clés,
images. Publié sur GitHub Pages sous `/cours`. Construit avec Astro.

## Lancer

```
pnpm install
pnpm dev      # serveur de développement
pnpm build    # construit dist/
pnpm test     # tests unitaires
pnpm e2e      # tests de bout en bout (après pnpm build)
```

## Aperçu sur téléphone

```
pnpm apercu
```

Construit le site puis le sert sur le réseau local : ouvre l'adresse « Network » affichée, suivie de `/cours/`,
depuis le téléphone connecté au même Wi-Fi.

## Pour les agents

Voir [AGENTS.md](AGENTS.md).
