import { PUBLICS, type PublicId } from './publics';
import type { Lecon } from './schema';

export type EntreeLecon = { id: string; data: Lecon };

export function publicsPresents(lecons: EntreeLecon[]) {
  const presents = new Set(lecons.map((l) => l.data.public));
  return PUBLICS.filter((p) => presents.has(p.id));
}

export function matieresDuPublic(lecons: EntreeLecon[], publicId: PublicId) {
  const vues = new Map<string, string>();
  for (const l of lecons) {
    if (l.data.public === publicId && !vues.has(l.data.matiere)) vues.set(l.data.matiere, l.data.matiereLibelle);
  }
  return [...vues]
    .map(([matiere, matiereLibelle]) => ({ matiere, matiereLibelle }))
    .sort((a, b) => a.matiereLibelle.localeCompare(b.matiereLibelle, 'fr'));
}

export function leconsDeMatiere(lecons: EntreeLecon[], publicId: PublicId, matiere: string) {
  return lecons
    .filter((l) => l.data.public === publicId && l.data.matiere === matiere)
    .sort((a, b) => a.data.ordre - b.data.ordre || a.data.titre.localeCompare(b.data.titre, 'fr'));
}

export function slugLecon(id: string): string {
  const segments = id.split('/');
  return segments[segments.length - 2] ?? id;
}

/** Un message par matière dont les leçons n'ont pas toutes le même libellé. */
export function libellesIncoherents(lecons: EntreeLecon[]): string[] {
  const libelles = new Map<string, Set<string>>();
  for (const l of lecons) {
    const deja = libelles.get(l.data.matiere) ?? new Set<string>();
    deja.add(l.data.matiereLibelle);
    libelles.set(l.data.matiere, deja);
  }
  return [...libelles]
    .filter(([, ensemble]) => ensemble.size > 1)
    .map(([matiere, ensemble]) => `matière « ${matiere} » : libellés différents ${[...ensemble].map((x) => `« ${x} »`).join(', ')}`);
}
