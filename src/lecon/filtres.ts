// Logique pure des filtres (sans DOM ni Astro) : utilisée à la construction du site et dans le navigateur.
import type { EntreeLecon } from './catalogue';
import { PUBLICS, trouverPublic, type PublicId } from './publics';

export type Filtres = { publics: string[]; matieres: string[] };

/** Les boutons publics sous lesquels une leçon de public `p` apparaît. */
export function publicsCorrespondants(p: PublicId): PublicId[] {
  const pub = trouverPublic(p);
  if (pub.sorte === 'classe' && pub.cycle) return [p, pub.cycle];
  if (pub.sorte === 'cycle') return [p, ...PUBLICS.filter((x) => x.sorte === 'classe' && x.cycle === p).map((x) => x.id)];
  return [p];
}

/** Boutons publics des leçons données, dans l'ordre de `PUBLICS`. */
export function boutonsPublics(lecons: EntreeLecon[]): { id: PublicId; libelle: string }[] {
  const presents = new Set<PublicId>();
  for (const l of lecons) for (const id of publicsCorrespondants(l.data.public)) presents.add(id);
  return PUBLICS.filter((p) => presents.has(p.id)).map((p) => ({ id: p.id, libelle: p.libelle }));
}

/** Boutons matières des leçons données, triés par libellé. */
export function boutonsMatieres(lecons: EntreeLecon[]): { matiere: string; libelle: string }[] {
  const vues = new Map<string, string>();
  for (const l of lecons) if (!vues.has(l.data.matiere)) vues.set(l.data.matiere, l.data.matiereLibelle);
  return [...vues]
    .map(([matiere, libelle]) => ({ matiere, libelle }))
    .sort((a, b) => a.libelle.localeCompare(b.libelle, 'fr'));
}

/** Une leçon est montrée si elle satisfait le filtre public ET le filtre matière (un filtre vide laisse tout passer). */
export function estMontree(lecon: { public: PublicId; matiere: string }, f: Filtres): boolean {
  const correspondants: string[] = publicsCorrespondants(lecon.public);
  const publicOk = f.publics.length === 0 || f.publics.some((p) => correspondants.includes(p));
  const matiereOk = f.matieres.length === 0 || f.matieres.includes(lecon.matiere);
  return publicOk && matiereOk;
}

/** Retire les valeurs inconnues et les doublons. */
export function nettoyer(f: Filtres, publics: string[], matieres: string[]): Filtres {
  const garder = (valeurs: string[], connues: string[]) => [...new Set(valeurs)].filter((v) => connues.includes(v));
  return { publics: garder(f.publics, publics), matieres: garder(f.matieres, matieres) };
}

/** Lit `?public=6e,5e&matiere=histoire` ; `null` si aucun des deux paramètres n'est présent. */
export function lireAdresse(search: string): Filtres | null {
  const params = new URLSearchParams(search);
  if (!params.has('public') && !params.has('matiere')) return null;
  const liste = (nom: string) => (params.get(nom) ?? '').split(',').filter((v) => v !== '');
  return { publics: liste('public'), matieres: liste('matiere') };
}

/** `''` sans filtre, sinon `?public=…&matiere=…` (paramètre vide omis). */
export function ecrireAdresse(f: Filtres): string {
  const morceaux: string[] = [];
  if (f.publics.length > 0) morceaux.push(`public=${f.publics.map(encodeURIComponent).join(',')}`);
  if (f.matieres.length > 0) morceaux.push(`matiere=${f.matieres.map(encodeURIComponent).join(',')}`);
  return morceaux.length > 0 ? `?${morceaux.join('&')}` : '';
}

/** Groupes par matière (triés par libellé) ; dans un groupe : public (ordre de `PUBLICS`), `ordre`, titre. */
export function grouperParMatiere(
  lecons: EntreeLecon[],
): { matiere: string; libelle: string; lecons: EntreeLecon[] }[] {
  const rang = (l: EntreeLecon) => PUBLICS.findIndex((p) => p.id === l.data.public);
  return boutonsMatieres(lecons).map(({ matiere, libelle }) => ({
    matiere,
    libelle,
    lecons: lecons
      .filter((l) => l.data.matiere === matiere)
      .sort((a, b) => rang(a) - rang(b) || a.data.ordre - b.data.ordre || a.data.titre.localeCompare(b.data.titre, 'fr')),
  }));
}
