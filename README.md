# cours

Site statique de cours illustrés, pensé pour une lecture facile (dyslexie) : phrases courtes, mots-clés,
images. Publié sur GitHub Pages sous `/cours`. Construit avec Astro.

## Lancer

```
pnpm install
pnpm dev      # serveur de développement
pnpm build    # construit dist/
pnpm test     # tests unitaires
pnpm e2e      # tests de bout en bout : construit son propre site de test et écrase dist/ ; relance `pnpm build` ensuite pour le vrai site
```

## Adresse publique

https://thibaut-d.github.io/cours/ : mis à jour automatiquement à chaque push sur `main`
(vérifications, tests, puis publication). Pendant la phase de relecture, les brouillons sont publiés aussi
(`APERCU: '1'` dans `.github/workflows/publier.yml`) pour être relus en direct sur le site.

## Écrire une leçon

Un dossier `contenu/<public>/<matiere>/<lecon>/` avec un `lecon.yaml`. Le champ `public` dit à qui s'adresse la
leçon (une classe, un cycle, `professeurs` ou `tout-public`) ; la page d'accueil la classe par matière et la
filtre par public. Détails dans [AGENTS.md](AGENTS.md) § 6.

## Relire un brouillon sur téléphone

```
pnpm apercu
```

Lance le serveur sur le réseau local, brouillons inclus. Astro affiche une ligne « Network » : sur le téléphone
(même Wi-Fi), ouvre `http://<IP-du-PC>:4321/cours/`.

## Pour les agents

Voir [AGENTS.md](AGENTS.md).
