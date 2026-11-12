export type CycleId = 'primaire' | 'college' | 'lycee';
export type Sorte = 'classe' | 'cycle' | 'apart';

type Public = { id: string; libelle: string; sorte: Sorte; cycle?: CycleId };

const classe = (id: string, libelle: string, cycle: CycleId) => ({ id, libelle, sorte: 'classe', cycle }) as const;
const cycleEntier = (id: string, libelle: string) => ({ id, libelle, sorte: 'cycle' }) as const;
const apart = (id: string, libelle: string) => ({ id, libelle, sorte: 'apart' }) as const;

export const PUBLICS = [
  cycleEntier('primaire', 'Primaire'),
  classe('cp', 'CP', 'primaire'),
  classe('ce1', 'CE1', 'primaire'),
  classe('ce2', 'CE2', 'primaire'),
  classe('cm1', 'CM1', 'primaire'),
  classe('cm2', 'CM2', 'primaire'),
  cycleEntier('college', 'Collège'),
  classe('6e', '6e', 'college'),
  classe('5e', '5e', 'college'),
  classe('4e', '4e', 'college'),
  classe('3e', '3e', 'college'),
  cycleEntier('lycee', 'Lycée'),
  classe('2de', '2de', 'lycee'),
  classe('1re', '1re', 'lycee'),
  classe('tle', 'Terminale', 'lycee'),
  cycleEntier('superieur', 'Supérieur'),
  apart('professeurs', 'Professeurs'),
  apart('tout-public', 'Tout public'),
] as const satisfies readonly Public[];

export type PublicId = (typeof PUBLICS)[number]['id'];

export const IDS_PUBLICS = PUBLICS.map((p) => p.id) as [PublicId, ...PublicId[]];

export function trouverPublic(id: PublicId): Public {
  return PUBLICS.find((p) => p.id === id)!;
}

/** Jeu d'objectifs de longueur qui s'applique à ce public (le primaire suit ceux du collège). */
export function objectifsDe(id: PublicId): 'college' | 'lycee' | 'superieur' {
  const p = trouverPublic(id);
  const cycle = p.sorte === 'classe' ? p.cycle : id;
  if (cycle === 'primaire' || cycle === 'college') return 'college';
  if (cycle === 'lycee') return 'lycee';
  return 'superieur';
}
