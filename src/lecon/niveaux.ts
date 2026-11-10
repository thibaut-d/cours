export const NIVEAUX = [
  { id: '6e', libelle: '6e', cycle: 'college' },
  { id: '5e', libelle: '5e', cycle: 'college' },
  { id: '4e', libelle: '4e', cycle: 'college' },
  { id: '3e', libelle: '3e', cycle: 'college' },
  { id: '2de', libelle: '2de', cycle: 'lycee' },
  { id: '1re', libelle: '1re', cycle: 'lycee' },
  { id: 'tle', libelle: 'Terminale', cycle: 'lycee' },
  { id: 'sup', libelle: 'Supérieur', cycle: 'superieur' },
] as const;

export type NiveauId = (typeof NIVEAUX)[number]['id'];
export type Cycle = (typeof NIVEAUX)[number]['cycle'];

export const IDS_NIVEAUX = NIVEAUX.map((n) => n.id) as [NiveauId, ...NiveauId[]];
