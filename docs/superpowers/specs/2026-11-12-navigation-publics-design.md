# Navigation par filtres, publics hors classe et visuels générés avec texte

Document de conception, 2026-11-12. Complète et modifie le
[document de conception initial](2026-11-10-cours-design.md) (§ 4.1 Navigation, § 4.2 densité, § 6 Images).
Les points marqués **[choix]** sont des choix du concepteur, que le propriétaire n'a pas tranchés.

## 1. Pourquoi

Le site va dépasser les cours d'une classe précise :

- des cours **sans classe précise**, rangés seulement par cycle (« collège », « lycée ») ;
- des cours **hors cursus**, par exemple « Initiation à la communication visuelle » ;
- des **dossiers pour les professeurs**, par exemple une prospective sur l'IA.

La navigation actuelle (accueil → niveau → matière → leçon, avec retour automatique au dernier niveau) ne
permet ni de partir d'une matière, ni de voir tout ce qui existe, ni de ranger ces nouveaux contenus.

Demande du propriétaire : naviguer **par niveau puis matière et par matière puis niveau**, avec des
**filtres** pour voir tout ce qu'il y a.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Une page d'accueil qui montre **toutes les leçons**, filtrables par **public** et par **matière**.
- Des publics qui ne sont pas des classes : cycle, professeurs, tout public.
- Les dossiers pour professeurs restent en **lecture visuelle** : c'est ce qui distingue le site.
- Codex peut produire des visuels **avec texte** (infographies, schémas) quand le HTML ne suffit pas.

**Non-objectifs** (pour l'instant)
- Un type de contenu « infographie » distinct de la carte (chantier séparé, noté dans `TODO.md`) **[choix]**.
- Une recherche par mot.
- Plusieurs publics pour une même leçon.

**Anti-objectifs**
- Un bouton de filtre qui mène à une liste vide.
- Des filtres cachés derrière un menu : ils restent visibles et modifiables à tout moment.
- Un dossier pour professeurs écrit comme un article long, sans visuel.

## 3. Le public remplace le niveau

Chaque leçon a **un seul public** (champ `public`, qui remplace `niveau`). Trois sortes :

| Sorte | Valeurs | Libellés affichés |
| --- | --- | --- |
| Classe | `cp`, `ce1`, `ce2`, `cm1`, `cm2`, `6e`, `5e`, `4e`, `3e`, `2de`, `1re`, `tle` | CP, CE1, CE2, CM1, CM2, 6e, 5e, 4e, 3e, 2de, 1re, Terminale |
| Cycle | `primaire`, `college`, `lycee`, `superieur` | Primaire, Collège, Lycée, Supérieur |
| Public à part | `professeurs`, `tout-public` | Professeurs, Tout public |

- Chaque classe appartient à un cycle : CP à CM2 → primaire ; 6e à 3e → collège ; 2de à Terminale → lycée.
- L'ancien niveau `sup` devient le cycle `superieur`.
- La **matière** reste un identifiant libre (`matiere`) avec son libellé (`matiereLibelle`) :
  histoire, data sciences, communication visuelle, intelligence artificielle…
  Deux leçons de même `matiere` doivent avoir le même `matiereLibelle` : sinon `pnpm valider` échoue
  **[choix]**.
- **Objectifs de longueur** (avertissements de `pnpm valider`) **[choix]** : une classe ou un cycle suit les
  objectifs de son cycle (le primaire suit ceux du collège) ; `professeurs` et `tout-public` suivent ceux
  du supérieur. Ce restent des objectifs, jamais des règles.
- Les deux leçons existantes passent de `niveau: 6e` à `public: 6e` ; leurs dossiers de contenu suivent
  (`contenu/<public>/<matiere>/<lecon>/`).

## 4. La page d'accueil : tout voir, filtrer

Une seule page d'accueil remplace l'accueil actuel et les pages « niveau » et « matière ».

**Filtres, en haut, toujours visibles**
- Deux rangées de boutons-filtres : **Public** puis **Matière**. Cibles d'au moins 48 px.
- Plusieurs boutons peuvent être choisis dans une même rangée ; entre les rangées, les filtres se
  combinent (public choisi **et** matière choisie).
- Un bouton **« Tout voir »** enlève tous les filtres.
- Un bouton n'existe que s'il montre au moins une leçon **[choix]** : un bouton de classe apparaît donc aussi
  quand seules des leçons de son cycle existent (une leçon `college` fait apparaître 6e, 5e, 4e, 3e), pour
  qu'un élève qui cherche sa classe trouve toujours ce qui le concerne.
- Dans une même rangée, les boutons choisis s'additionnent (6e **ou** 5e) ; entre les rangées, ils se
  combinent (public **et** matière) **[choix]**. Les boutons ne se masquent pas selon l'autre rangée : une
  combinaison vide est possible et donne le message ci-dessous.
- **Une classe montre aussi les leçons de son cycle** (décision du propriétaire) : « 6e » montre les leçons
  `6e` et `college`. Une telle leçon porte son étiquette « Collège » pour qu'on comprenne pourquoi elle est
  là. Choisir un cycle montre seulement les leçons rangées sous ce cycle et ses classes **[choix]**.
- Ordre des boutons publics : les classes et cycles dans l'ordre scolaire (primaire, CP… CM2, collège,
  6e… 3e, lycée, 2de… Terminale, supérieur), puis professeurs, tout public **[choix]**. Matières : ordre
  alphabétique.
- Si aucune leçon ne correspond (combinaison public × matière vide), un message court le dit et propose
  « Tout voir » **[choix]**.

**Mémoire des filtres**
- Les filtres choisis restent en mémoire dans le navigateur (stockage local) et sont rétablis au retour
  (décision du propriétaire).
- Ils figurent aussi dans l'adresse (`…/cours/?public=6e&matiere=histoire`), qu'on peut mettre en favori
  ou partager ; une adresse avec filtres l'emporte sur la mémoire **[choix]**.
- Une valeur inconnue dans l'adresse ou en mémoire (public ou matière qui n'existe plus) est ignorée sans
  message **[choix]**.
- Si le stockage est bloqué, les filtres marchent sans mémoire. Sans JavaScript, la page montre toutes les
  leçons et les filtres sont masqués **[choix]** (pas une page par combinaison : le site reste simple).
- Aucune leçon visible sur tout le site : un message court le dit, sans filtres **[choix]**.

**Liste des leçons**
- Des **tuiles**, regroupées par matière (titre de groupe = libellé de la matière), dans l'ordre :
  public dans l'ordre scolaire, puis `ordre`, puis titre **[choix]**.
- Chaque tuile : l'image de la première carte qui a un fichier image (sinon un fond uni avec le
  pictogramme de cette carte), le **titre**, et deux étiquettes : **public** et **matière** **[choix]**.
- Toute la tuile est un lien vers la leçon.

## 5. Adresses et fil d'Ariane

- Une leçon garde une adresse lisible et unique : `…/cours/<public>/<matiere>/<lecon>/` **[choix]**. (Une
  adresse sans le public, proposée en discussion, risquerait deux leçons de même nom dans une matière,
  par exemple « introduction » en 6e et en 2de.)
- Les pages `…/cours/<public>/` et `…/cours/<public>/<matiere>/` disparaissent. Les anciennes adresses ne
  sont pas redirigées : seul le propriétaire les connaît **[choix]**.
- Fil d'Ariane d'une leçon : **Cours** (accueil, filtres en mémoire) / **Histoire** (accueil filtré sur la
  matière) / titre de la leçon **[choix]**.
- Le retour automatique au dernier niveau (`cours-niveau`, `src/scripts/dernier-niveau.ts`) disparaît,
  remplacé par la mémoire des filtres.

## 6. Visuels générés avec texte (modifie le § 6 initial)

Décision du propriétaire, 2026-11-12 : Codex peut produire **tout type de contenu visuel** avec son
générateur d'images (photo, infographie, schéma), **y compris avec du texte**.

- **Le HTML reste préféré quand c'est possible** : frise, carte simple, tableau, formule, schéma simple sont
  dessinés par le site (texte sûr, lisible à voix haute, réglable par l'utilisateur).
- **Image générée avec texte** pour un visuel complexe que le HTML rendrait mal : schéma de SVT avec des
  flèches, infographie dense, coupe annotée.
- Garde-fous **[choix]** :
  - chaque mot écrit dans l'image est vérifié (orthographe, exactitude) ; une seule faute → l'image est
    régénérée ;
  - le texte de l'image est repris en entier dans le texte alternatif (`alt`), pour la lecture à voix haute
    et les lecteurs d'écran ;
  - le texte dans l'image suit les règles de lisibilité du site autant que le générateur le permet :
    police sans empattement, gros caractères, minuscules, peu de mots ;
  - la photo et la reconstitution restent **sans texte** : le texte n'est permis que dans un schéma ou une
    infographie.
- Le `AGENTS.md` (§ 6 et § 7) est mis à jour en conséquence.

## 7. Laissé au constructeur

- Le détail visuel des boutons-filtres (état choisi visible autrement que par la couleur seule, par exemple
  une coche et un fond plein), dans le respect des règles de lisibilité.
- Le format exact de stockage des filtres et de l'adresse.
- La migration des tests e2e et des données d'essai (`e2e/contenu-test/`).
- Le maintien de la langue de la leçon : les libellés de filtres et de tuiles restent en français sur
  l'accueil, même pour une leçon en anglais.
