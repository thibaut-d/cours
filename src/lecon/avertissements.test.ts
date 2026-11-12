import { describe, expect, it } from 'vitest';
import { avertissements } from './avertissements';
import { leconSchema, type Lecon } from './schema';

const carte = { motCle: 'mot' };
const lecon = (publicLecon: string, cartes: object[], titre = 'Chasse'): Lecon =>
  leconSchema.parse({
    titre: 'Essai', public: publicLecon, matiere: 'histoire', matiereLibelle: 'Histoire', ordre: 1, statut: 'brouillon',
    sources: [{ libelle: 's' }], chapitres: [{ titre, cartes }],
  });
const leconAvec = (n: number, publicLecon: string) => lecon(publicLecon, Array.from({ length: n }, () => carte));

describe('avertissements', () => {
  it('signale trop peu de cartes en 6e', () =>
    expect(avertissements(leconAvec(3, '6e'))).toContainEqual(expect.stringContaining('3 cartes')));
  it('ne dit rien pour 8 cartes en 6e', () => expect(avertissements(leconAvec(8, '6e'))).toEqual([]));
  it('signale une phrase de 21 mots', () => {
    const phrase = Array.from({ length: 21 }, (_, i) => `m${i}`).join(' ');
    const l = lecon('6e', Array.from({ length: 8 }, () => ({ phrases: [phrase] })));
    expect(avertissements(l)[0]).toMatch(/21 mots/);
  });
  it('signale trop de phrases', () => {
    const l = lecon('6e', Array.from({ length: 8 }, () => ({ phrases: ['un', 'deux'] })));
    expect(avertissements(l).join('\n')).toMatch(/2 phrases/);
  });
  it('signale 8 cartes au supérieur', () =>
    expect(avertissements(leconAvec(8, 'superieur'))).toContainEqual(expect.stringContaining('8 cartes')));
  it('signale un titre de plus de 6 mots', () =>
    expect(avertissements(lecon('6e', Array.from({ length: 8 }, () => carte), 'un deux trois quatre cinq six sept'))
      .some((m) => m.startsWith('un deux trois quatre cinq six sept :') && m.includes('titre de 7 mots'))).toBe(true));
});
