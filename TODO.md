# TODO

Le premier fichier à lire pour reprendre le travail (Claude ou Codex). Le tenir à jour en fin de session.

## Où on en est (2026-11-12)

- **Navigation faite** : page d'accueil unique avec toutes les leçons, filtres par public et par matière
  (retenus dans le navigateur et dans l'adresse), champ `public` à la place de `niveau`
  (`docs/superpowers/specs/2026-11-12-navigation-publics-design.md`).
- **Fait** : socle du site et fiche défilante (plan `docs/superpowers/plans/2026-11-10-socle-et-fiche.md`),
  publication automatique sur GitHub Pages, icône du site.
- **Leçons** : « Les premiers humains » et « Vivre au Paléolithique » (6e, histoire), en brouillon, faits
  vérifiés ; leurs 35 images sont encore à générer (`aGenerer` dans `lecon.yaml`).
- **Génération d'images par Codex** depuis Claude (`codex exec`) : essai concluant le 2026-11-11.

## Feuille de route

1. **Images** : outillage du lot (format WebP, taille, prompts conservés), génération des 35 images des
   leçons pilotes par Codex, vérification image par image, puis relecture de l'auteur.
2. **Diaporama, PDF et PowerPoint** générés depuis la même leçon (avec notes de l'orateur).
3. **Recette « créer une leçon »** pas à pas, puis conversion du cours d'introduction au NLP (en anglais).
4. **Charte graphique** (ci-dessous).
5. **Infographies** : un type de contenu à part entière (pour les dossiers destinés aux professeurs
   notamment), en HTML ou en image générée par Codex.

## Petits défauts repérés

- Fil d'Ariane : espaces irréguliers (« Cours /   6e   / ») dus à la largeur minimale de 48 px des liens.
- Le bouton « Cacher les réponses » semble ne pas utiliser la police Luciole : à vérifier.
- La publication GitHub Actions est passée de 2 min 30 à 8 min, bloquée sur l'installation du navigateur
  de test : mettre ce navigateur en cache et fixer un `timeout-minutes`.

## Charte graphique : codes couleurs et codes visuels communs

Demandé par le propriétaire le 2026-11-10 ; laissé ouvert dans le [document de conception](docs/superpowers/specs/2026-11-10-cours-design.md).

Réfléchir en profondeur, puis écrire la charte dans `docs/design/` :

- **Codes couleurs** : ce qu'une couleur veut dire sur le site (position de la carte, type de contenu,
  matière, autre chose ?).
- **Codes visuels communs** : pictogrammes, formes, flèches, repères qui gardent le même sens d'une leçon à
  l'autre.
- **Ce qui aide un enfant ou un étudiant dys** : partir de la recherche
  [docs/recherche/2026-11-10-mise-en-page-dyslexie.md](docs/recherche/2026-11-10-mise-en-page-dyslexie.md)
  (couleur jamais seule porteuse de sens, contraste, constance du gabarit).
- **Symbolique culturelle des couleurs** : ce que les couleurs évoquent déjà (rouge = danger ou erreur,
  vert = juste…), pour s'appuyer dessus au lieu de la contredire.
- **Ne pas s'enfermer** : la charte reste flexible et adaptable au sujet. Une leçon peut s'en écarter quand
  son contenu l'exige (couleurs propres à une carte de géographie, à un drapeau, à un domaine scientifique).
