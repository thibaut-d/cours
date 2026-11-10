import { NIVEAUX, type NiveauId } from './niveaux';
import type { Lecon } from './schema';

export type EntreeLecon = { id: string; data: Lecon };

export function niveauxPresents(lecons: EntreeLecon[]) {
  const presents = new Set(lecons.map((l) => l.data.niveau));
  return NIVEAUX.filter((n) => presents.has(n.id));
}

export function matieresDuNiveau(lecons: EntreeLecon[], niveau: NiveauId) {
  const vues = new Map<string, string>();
  for (const l of lecons) {
    if (l.data.niveau === niveau && !vues.has(l.data.matiere)) vues.set(l.data.matiere, l.data.matiereLibelle);
  }
  return [...vues]
    .map(([matiere, matiereLibelle]) => ({ matiere, matiereLibelle }))
    .sort((a, b) => a.matiereLibelle.localeCompare(b.matiereLibelle, 'fr'));
}

export function leconsDeMatiere(lecons: EntreeLecon[], niveau: NiveauId, matiere: string) {
  return lecons
    .filter((l) => l.data.niveau === niveau && l.data.matiere === matiere)
    .sort((a, b) => a.data.ordre - b.data.ordre || a.data.titre.localeCompare(b.data.titre, 'fr'));
}

export function slugLecon(id: string): string {
  const segments = id.split('/');
  return segments[segments.length - 2] ?? id;
}
