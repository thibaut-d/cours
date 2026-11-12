import type { Lecon } from './schema';

export type EntreeLecon = { id: string; data: Lecon };

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
