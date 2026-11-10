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

## Adresse publique

https://thibaut-d.github.io/cours/ : mis à jour automatiquement à chaque push sur `main`
(vérifications, tests, puis publication). Les leçons en brouillon ne sont pas publiées.

## Relire un brouillon sur téléphone

```
pnpm apercu
```

Lance le serveur sur le réseau local, brouillons inclus. Astro affiche une ligne « Network » : sur le téléphone
(même Wi-Fi), ouvre `http://<IP-du-PC>:4321/cours/`.

## Pour les agents

Voir [AGENTS.md](AGENTS.md).
