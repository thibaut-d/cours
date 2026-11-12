import { describe, expect, it } from 'vitest';
import { IDS_PUBLICS, objectifsDe, trouverPublic } from './publics';

describe('publics', () => {
  it('ids dans l’ordre', () =>
    expect([...IDS_PUBLICS]).toEqual([
      'primaire', 'cp', 'ce1', 'ce2', 'cm1', 'cm2', 'college', '6e', '5e', '4e', '3e',
      'lycee', '2de', '1re', 'tle', 'superieur', 'professeurs', 'tout-public',
    ]));
  it('libellés', () => {
    expect(trouverPublic('tle').libelle).toBe('Terminale');
    expect(trouverPublic('tout-public').libelle).toBe('Tout public');
  });
  it('cycle seulement pour les classes', () => {
    expect(trouverPublic('6e').cycle).toBe('college');
    expect(trouverPublic('college').cycle).toBeUndefined();
  });
  it('objectifs par public', () => {
    expect(objectifsDe('cm1')).toBe('college');
    expect(objectifsDe('primaire')).toBe('college');
    expect(objectifsDe('3e')).toBe('college');
    expect(objectifsDe('lycee')).toBe('lycee');
    expect(objectifsDe('2de')).toBe('lycee');
    expect(objectifsDe('professeurs')).toBe('superieur');
    expect(objectifsDe('tout-public')).toBe('superieur');
    expect(objectifsDe('superieur')).toBe('superieur');
  });
});
