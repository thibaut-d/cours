# Cours — document de conception

Date : 2026-11-10. Statut : **validé par le propriétaire** le 2026-11-10, point par point.
Recherche associée : [docs/recherche/2026-11-10-mise-en-page-dyslexie.md](../../recherche/2026-11-10-mise-en-page-dyslexie.md)
(citée plus bas « R § n »).

Convention : ce que le propriétaire a dit ou décidé est écrit sans marque. Ce qui est un choix du concepteur
(Claude) est marqué **[choix]** ; le propriétaire peut le renverser en relisant. Ce qui reste ouvert est
marqué **[à décider]**.

---

## 1. Pourquoi

Beaucoup d'élèves dyslexiques n'apprennent rien d'un cours écrit, même relu plusieurs fois, alors qu'une
fiche infographique illustrée leur fait retenir l'essentiel. Le site leur offre des cours **à regarder plus
qu'à lire**, consultables seuls sur téléphone et ordinateur, sans dépendre d'un adulte qui leur lit le cours,
et qui s'appuient sur la mémoire visuelle et spatiale.

Il doit aussi **durer** : grandir de la 6e à la fac, accueillir des cours de niveau supérieur, et servir au
plus grand nombre d'élèves. Tout est public et libre.

**Réussite** : un lecteur dyslexique (§ 3) retient mieux ses leçons avec le site qu'avec un cours écrit.
On le vérifie par l'essai à un seul élève : le lendemain, retrouve-t-il les mots-clés sans regarder ?
(R § 9).

> Le contexte personnel qui a motivé ces choix est dans `prive/contexte.md`, **hors Git**. Rien de ce
> fichier ne doit être recopié dans un fichier versionné, un commit, une leçon ou le site.

## 2. Objectifs, non-objectifs, anti-objectifs

**Objectifs**
- Fiches « une idée par carte » qui défilent, très visuelles, presque sans texte, lisibles sans zoom au
  téléphone.
- Un même cours rendu en fiche, en diaporama projetable, en PDF et en PowerPoint modifiable.
- Navigation niveau → matière → leçon, qui grandit avec les années.
- Production par agents (Claude, Codex) à partir de fichiers, ou d'un simple sujet + le programme officiel.
- Lecture à voix haute.

**Non-objectifs** (pour l'instant)
- Comptes, serveur, base de données, suivi des élèves par un adulte.
- **Pas d'exercices pour le moment** : ni quiz, ni saisie de réponse, ni score, ni rappels de révision,
  ni classements (décision du propriétaire, 2026-11-10). Le site est un **support d'apprentissage**. Seule
  exception voulue : les « questions qui peuvent tomber », réponse visible (§ 4.4).
- Application mobile installée. (Le site doit marcher dans le navigateur du téléphone ; le mode hors ligne
  n'est pas demandé.)
- Couvrir tout le programme : le site se remplit au fil des leçons réellement étudiées.

**Anti-objectifs** (ce qui serait un échec même si « ça marche »)
- Une fiche qui oblige à **lire** pour comprendre : paragraphe, bloc de 3 lignes, texte qu'il faut zoomer.
- Une **faute** dans un mot à apprendre, ou une image **fausse** (anachronisme, mauvais nombre, mauvais
  lieu). C'est pire que pas d'image : il la retiendra.
- Des images **décoratives** : elles font baisser l'apprentissage (R § 4.3, prouvé).
- Un rendu **infantilisant** (emoji, mascottes, dessin à plat de cahier d'activités). Leçon payée cher sur
  Brindilo (ADR 0009 du dépôt `capsicum`) : 132 images sur 153 à refaire.
- Deux versions d'un même cours qui divergent (fiche d'un côté, PowerPoint de l'autre).
- Publier des contenus protégés (pages de manuel scannées, cours d'un enseignant recopiés) ou des données
  personnelles (sur l'auteur, sa famille ou un élève).

## 3. Les lecteurs

**Lecteur de référence : un lecteur dyslexique, à tous les niveaux** (décision du propriétaire,
2026-11-10). Ce n'est pas un élève de 6e figé : le site va de la 6e à la fac et ses lecteurs grandissent.
Pour chaque leçon, on conçoit pour **un élève dyslexique du niveau de la leçon**, qui lit difficilement mais
comprend vite ce qu'il voit — y compris pour un cours de fac. Raison : concevoir pour ce lecteur **impose une
communication visuelle efficace** qui profite à tous, en particulier aux étudiants qui ne maîtrisent pas
bien la langue du cours (français ou anglais). Simple ne veut jamais dire enfantin : le ton et les images
sont ceux de l'âge du lecteur.

Qui lit le site :
1. **Élèves du collège au lycée** qui révisent seuls, sur téléphone ou ordinateur.
2. **Étudiants d'un cours présenté en classe** : ils voient le diaporama projeté, puis relisent seuls
   (fiche, PDF ou PowerPoint) ; certains suivent le cours dans une langue qui n'est pas la leur.
3. **L'auteur** (le propriétaire du dépôt) : fournit les sources, présente certains cours, relit et valide.
4. **N'importe quel élève** venu par un lien : rien ne doit supposer qu'on connaît le lecteur.

## 4. Ce qu'on voit

### 4.1 Navigation

Accueil → **niveau** (6e, 5e, 4e, 3e, 2de, 1re, Tle, Supérieur) → **matière** → **leçon**.
- Adresses stables et lisibles : `/6e/histoire/paleolithique/` **[choix]**.
- Les leçons d'une matière sont dans l'ordre du programme (numéro de chapitre) **[choix]**.
- Le site retient le dernier niveau choisi et y ramène directement (stockage local du navigateur) **[choix]**.
- Un niveau ou une matière sans leçon publiée n'apparaît pas (pas de pages « Bientôt ») **[choix]**.
- Sur chaque leçon : boutons **Fiche**, **Diaporama**, **PDF**, **PowerPoint**.

### 4.2 La fiche (format retenu : « A · une idée par carte », maquette validée le 2026-11-10)

Une colonne qui défile verticalement, la même sur ordinateur (centrée, plus grande).

1. **Bandeau titre** : titre de la leçon (≤ 6 mots), niveau et matière.
2. **Cartes**. Leur nombre et la longueur des phrases sont des **objectifs qui dépendent du niveau**, pas
   des plafonds fixes (décision du propriétaire, 2026-11-10). Au-delà de l'objectif, on **découpe en
   chapitres** : une leçon peut contenir plusieurs chapitres, chacun avec ses cartes et sa carte d'ensemble
   (ex. *Introduction to NLP* et ses parties Domains, From words to numbers,
   Analysis…). Objectifs de départ **[choix]**, à ajuster à l'usage :
   - collège : 6 à 12 cartes par chapitre, une phrase de 20 mots au plus ;
   - lycée : 10 à 20 cartes, 1 à 2 phrases ;
   - supérieur : 15 à 30 cartes (diapositives), quelques lignes.
   La validation **avertit** quand un objectif est dépassé ; elle ne bloque pas la construction.
   Chaque carte :
   - une **grande illustration** qui montre l'idée, sans aucun texte dedans ;
   - un **pictogramme** + un **mot-clé** (le mot à apprendre) ;
   - **une phrase courte** au collège, plus selon le niveau (§ 4.3) ;
   - un numéro et une couleur, un indicateur « 3 / 7 » ;
   - un bouton **écouter** ;
   - facultatif, replié : « en savoir plus » (1-3 lignes, chiffres ou exception).
3. **Carte d'ensemble** : la vue d'ensemble qui faisait la force des fiches A4 (R § 11, tension 4) —
   mêmes numéros, couleurs, pictos et mots-clés, sans information nouvelle. Pour une leçon d'histoire ce
   peut être une frise, pour la géographie une carte : c'est là que la force visuo-spatiale travaille.
4. **Formule finale** du type « PALÉOLITHIQUE = VIE NOMADE ».
5. **Questions qui peuvent tomber** (§ 4.4).

La carte d'ensemble **remplace** le bloc « À retenir » en pictogrammes des fiches ChatGPT, pour ne pas
enchaîner trois résumés (R § 11, tension 4 ; règle « on applique la recherche »).

### 4.3 Densité selon le niveau

**La densité est un objectif, jamais une règle** (décision du propriétaire, 2026-11-10 : une règle ne serait
pas assez flexible). Le modèle de contenu est le même à tous les niveaux et **toute carte peut combiner
librement** image, pictogramme, mot-clé, phrases, liste de points, schéma, formule, extrait, tableau simple.
Ce que la carte contient se décide au cas par cas selon le sujet.

Repères pour l'agent qui conçoit, pas des contraintes :
- **collège** : viser une image, un mot-clé, une phrase ;
- **lycée / supérieur** : une carte peut devenir une vraie diapositive (schéma, 3 à 5 points, formule).

Ni le schéma de validation ni les composants n'imposent ces repères ; au plus, la validation avertit
(§ 4.2). Les règles typographiques du § 5 (police, taille, interligne, pas d'italique…) restent, elles,
valables partout.

### 4.4 Questions qui peuvent tomber

Décision du propriétaire (2026-11-10). En fin de chapitre, les questions probables au contrôle, chacune
avec **sa réponse affichée juste en dessous** : c'est du contenu à apprendre, pas un exercice. La réponse
suit les mêmes règles que les cartes (image ou mot-clé d'abord, phrase courte).

- Un bouton **« Cacher les réponses »** permet à celui qui le veut de s'exercer volontairement : les
  réponses se masquent, et il les dévoile une par une en touchant. Par défaut, elles sont visibles.
- Pas de saisie, pas de score, pas de rappel de révision, rien n'est enregistré.
- Pour un sujet traité à partir du programme (§ 7, entrée 2), les questions viennent des attendus de fin
  d'année ; pour un cours fourni, des questions du cours ou du professeur quand il y en a.
- Dans le diaporama, PDF et PowerPoint : une diapositive par question, réponse sur la diapositive
  suivante **[choix]**.

### 4.5 Écouter

Un bouton par carte lit le mot-clé puis la phrase, avec la **voix de synthèse du navigateur** (Web Speech,
gratuite, sans serveur), vitesse réglable. Une voix de synthèse est jugée acceptable.
Si la qualité déçoit, plan B : générer à l'avance des fichiers audio avec Piper (libre, local) et les
publier comme des images. Aide secondaire : l'effort principal va au visuel.

### 4.6 Réglages de lecture

Taille du texte, espacement (normal / aéré), fond (crème, blanc, 1-2 autres), mémorisés dans le navigateur
(R rec. 14) **[choix]**. Le zoom du navigateur n'est jamais bloqué.

### 4.7 Diaporama, PDF, PowerPoint

Certains cours sont projetés en classe puis relus seuls par les étudiants ; les deux formats sont exigés.
- **Diaporama** dans le site : une carte = une diapositive, plein écran, flèches du clavier et
  télécommande de présentation, **notes de l'orateur** visibles seulement dans une vue présentateur
  **[choix]**. Format 16:9.
- **PDF** : une page par diapositive, généré automatiquement à la publication.
- **PowerPoint (.pptx)** : généré automatiquement à la publication, **modifiable** (vrais blocs de texte et
  images, pas des captures d'écran), même mise en page que le diaporama.
- Les fichiers sont téléchargeables depuis la leçon.
- **Le PowerPoint est une sortie, pas une source** **[choix]**. On corrige un cours dans son fichier de leçon
  (en le demandant à un agent), jamais dans le .pptx ; une note dans le fichier le rappelle. Un PowerPoint
  retouché à la main peut revenir comme **nouvelle source** (§ 7, entrée 3), mais il n'y a pas de
  synchronisation dans les deux sens.

## 5. Règles de lisibilité

Source : R § 12 (gabarit chiffré), à ajuster après l'essai à un seul élève (R § 9).

| Élément | Valeur |
|---|---|
| Police | **Luciole** (conçue en France, licence CC BY 4.0, attribution obligatoire), une seule pour la lecture ; Atkinson Hyperlegible en repli. Pas de police « dyslexie » (aucun effet mesuré). |
| Phrase | 20-22 px au téléphone, interligne 1,5, alignée à gauche, jamais justifiée, pas de césure, ≤ 60 caractères par ligne |
| Mot-clé | 28-36 px, gras, en **minuscules** (comme dans ses cahiers et ses contrôles) |
| Étiquettes de structure | MAJUSCULES **accentuées**, 1-2 mots (« À RETENIR », « EXEMPLE ») ; jamais une phrase en capitales |
| Mise en valeur | gras ou taille ; jamais d'italique ni de souligné |
| Espacement | lettres +0,05 em, mots +0,16 em ; option aérée |
| Couleur | jamais seule porteuse de sens : toujours avec numéro et picto ; contraste ≥ 4,5:1 (≥ 3:1 au-delà de 24 px) |
| Fond | crème `#FBF7EE`, texte `#1E1E1E` |
| Pictogrammes | SVG dessinés, unis, recolorables ; **aucun emoji** |
| Cibles tactiles | ≥ 48 px |
| Écrans contrôlés | 320, 375, 390, 768, 1280 px ; diaporama en 16:9 |
| Densité | quand c'est trop dense on enlève ou on ajoute une carte ; on ne réduit jamais la police |

**Code couleur et codes visuels communs** : pas encore définis. Décision du propriétaire (2026-11-10) : y
réfléchir en profondeur dans une **charte graphique** à part (ce qui aide un lecteur dys, symbolique
culturelle des couleurs), qui reste **flexible et adaptable au sujet**. Chantier noté dans
[TODO.md](../../../TODO.md). En attendant, le constructeur prévoit une palette remplaçable et ne fige aucun
sens de couleur dans le code.

**Règle générale (décision du propriétaire, 2026-11-10) : on applique les recommandations de la recherche.**
D'où les mots-clés en minuscules grasses et les MAJUSCULES réservées aux étiquettes de structure (R § 11,
tension 1). Quand la recherche et une habitude des fiches ChatGPT divergent, la recherche l'emporte ;
l'essai à un seul élève (R § 9) peut ensuite ajuster.

## 6. Les images

Le site a besoin de beaucoup d'images. **Codex génère les
images**, Claude les commande et les vérifie (organisation reprise de Brindilo).

- **Aucun texte, chiffre ou lettre dans une image** : les mots sont posés par la page (orthographe sûre,
  lecture à voix haute, traduction possible). C'est la correction du défaut des fiches ChatGPT
  (« ÉPOQUE MODRNE »).
- **Une image = l'idée de sa carte**, un sujet principal, rien de décoratif ni d'anachronique.
- **Deux registres** (R § 11, tension 3) **[choix]** : « **scène** » pour l'histoire, la géographie, le
  vocabulaire concret ; « **schéma** » pour les mathématiques, la grammaire, les sciences (formes simples,
  flèches et repères spatiaux, positions constantes).
- **Style : photoréaliste à tous les niveaux** (décision du propriétaire, 2026-11-10) : on s'adresse à des
  préadolescents et à des étudiants, donc **rien d'enfantin** — ni dessin à plat, ni mascotte, ni emoji. Les
  scènes du passé sont des **reconstitutions photoréalistes** marquées « Image générée ». Les schémas restent
  dessinés par le site. Un **style commun** est rédigé une fois et recopié en tête de chaque prompt (modèle :
  celui de Brindilo, charte § 2).
- **Images reprises d'un cours existant** (photos d'un PowerPoint fourni) : on suit la source
  indiquée dans le document ; si la licence permet la republication, on garde l'image avec son crédit,
  sinon on la régénère (cas le plus fréquent).
- **Formats** : carte de fiche 4:3 paysage ; diaporama 16:9 (ou la même 4:3 posée dans la diapositive)
  **[choix]**. WebP, 1600 px de large.
- **Circuit** : l'agent qui conçoit la leçon écrit une entrée par image dans `TODO-IMAGES.md` (chemin, format,
  registre, prompt complet et autonome, ce que l'image doit montrer exactement) ; Codex génère, dépose,
  renseigne le **manifeste des images** (chemin, texte alternatif, prompt réellement utilisé, `generated`) ;
  l'agent vérificateur regarde chaque image et la refuse si elle est fausse ou décorative (retour en `todo`
  avec motif). Mention « Image générée » discrète sur chaque image.
- **Les visuels qui portent du texte sont construits par le site, pas générés** **[choix]**. Une frise
  (dates, périodes), une carte (lieux), un schéma de maths, de grammaire ou de sciences, la carte
  d'ensemble : ce sont des composants qui dessinent en SVG/HTML à partir de données de la leçon (dates,
  positions, flèches, étiquettes). Ils sont rendus à l'identique dans la fiche, le diaporama, le PDF et le
  PowerPoint. Deux formes : (a) **composant de données pur** (frise, schéma) ; (b) **image générée sans texte
  + étiquettes posées par la page** à des coordonnées en pourcentage (scène annotée, fond de carte). Codex ne
  produit donc jamais que des images muettes. La carte d'ensemble du Paléolithique sera une frise.
- Les vignettes des fiches ChatGPT existantes ne sont **pas** réutilisées telles quelles (texte incrusté,
  fautes) : elles servent de source et de référence de style.

## 7. D'où viennent les leçons

Trois entrées, un seul circuit.
1. **Fichiers** dans `./sources` ou dans **n'importe quel dossier désigné par le propriétaire** : scans de
   cahier ou de cours, fiches ChatGPT A4 à redécouper en cartes, présentations PowerPoint.
2. **Un sujet seul** (« le Paléolithique, 6e ») : l'agent cherche ce que le **programme officiel** de
   l'Éducation nationale attend à ce niveau (Bulletin officiel, Eduscol : attendus de fin d'année, repères
   annuels), en tire les notions et le vocabulaire à savoir, puis conçoit la leçon. La leçon garde la liste
   de ces sources.
3. **Un PowerPoint fourni** (ex. *Introduction to NLP*, 75 diapos, **en anglais**) : une leçon est publiée
   **dans sa langue d'origine**, sans traduction (décision du propriétaire). Convertie en leçon du site ; il en
   ressort en diaporama, PDF et PowerPoint propres.

**Circuit** : extraire le savoir → découper en cartes → commander les images → **vérification par un agent
distinct** (faits contre sources et programme, orthographe, chaque image regardée, règles du § 5) →
**relecture et validation par le propriétaire** → publication.

- Tant qu'elle n'est pas validée, une leçon est un **brouillon** : visible en aperçu local, absente du site
  public **[choix]**. L'aperçu est servi sur le réseau de la maison pour être relu **sur téléphone** et essayé
  sur un élève avant publication **[choix]**. Les fichiers d'un brouillon sont dans le dépôt public (seul le
  site les exclut) : acceptable puisque tout est public, et ça évite une branche à part **[choix]**.
- **Codex** : la ligne de commande Codex (`codex`, v0.167) est installée sur le poste de travail.
  L'agent qui commande les images la lance lui-même (`codex exec`) en lui confiant `TODO-IMAGES.md`, sans
  étape manuelle **[choix]** ; le constructeur vérifie d'abord que la génération d'images est disponible dans
  ce mode, sinon le propriétaire lance Codex à la main sur la même liste.
- **Matériaux déjà là** : les 15 fiches ChatGPT (histoire 6e, chiffres romains, lecture de *Noé face au
  Déluge*) sont copiées dans `sources/chatgpt-6e/` ; elles fournissent la leçon pilote et la référence de
  style. Le dépôt Brindilo est accessible en local dans `C:\code\capsicum` (circuit des images :
  `docs/content/images.md`, `TODO-IMAGES.md`, `scripts/import-generated-images.mjs` ; leçons : ADR 0009).
- **Supérieur** : pas de programme officiel ; l'ordre des leçons est celui du propriétaire, les « matières »
  sont ses intitulés de cours (ex. Data sciences).
- `sources/` **n'est pas versionné** (dépôt public : scans de cahier, documents protégés, travaux
  d'élèves) **[choix]**. Le site publie une reformulation, jamais une copie de manuel.
- **Aucune donnée personnelle** dans le dépôt ni sur le site : ni sur l'auteur ni sur sa famille ni sur un
  élève (nom, photo, bilans, anecdotes). Le contexte personnel vit dans `prive/`, exclu de Git (décision du
  propriétaire, 2026-11-10).

## 8. Comment c'est fait

Choix techniques du concepteur ; le propriétaire les a délégués (« conçu par Claude et Codex »).

- **Hébergement** : GitHub Pages, dépôt public `github.com/thibaut-d/cours`, déploiement par GitHub Actions à
  chaque push sur `main` (décidé le 2026-11-10).
- **Générateur de site** : **Astro**, sortie 100 % statique, quelques îlots interactifs (diaporama, écouter,
  réglages) **[choix]** — déjà maîtrisé sur Brindilo.
- **Contenu** : un dossier par leçon (`contenu/<niveau>/<matiere>/<lecon>/`) avec un fichier de données
  structuré (cartes, mots-clés, phrases, notes de l'orateur, sources, statut, profil) et ses images ;
  **validé par un schéma** (Zod) qui fait échouer la construction sur une erreur de structure (image
  manquante, texte alternatif absent, champ obligatoire vide) et **avertit** quand un objectif de longueur ou
  de nombre de cartes du niveau est dépassé **[choix]**.
- **PDF** : impression du diaporama par un navigateur sans tête pendant la construction **[choix]**.
- **PowerPoint** : généré depuis les mêmes données par une bibliothèque JavaScript (type PptxGenJS) pendant la
  construction **[choix]**.
- **Contrôles** à chaque push : validation du contenu, construction, tests d'accessibilité automatiques
  (axe), captures aux largeurs du § 5 **[choix]**.
- **Mémoire du projet** : `AGENTS.md` (contrat commun Claude/Codex : règles, circuit, où sont les choses),
  `CLAUDE.md` qui y renvoie, `TODO-IMAGES.md`, une **recette « créer une leçon »** pas à pas, les décisions
  dans `docs/decisions/`, la charte des images dans `docs/design/` **[choix]**.

## 9. Laissé au constructeur

Choix des bibliothèques précises, structure exacte du fichier de leçon, nommage des composants, palette
exacte (dans les contraintes du § 5), mise en page de la vue présentateur, manière d'exclure les brouillons
du site public, organisation des tests. La première leçon réelle (Paléolithique, 6e, à partir des fiches
existantes) sert de pilote pour valider le gabarit avant d'en produire d'autres.
