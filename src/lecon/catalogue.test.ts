import { describe, expect, it } from 'vitest';
import { estVisible } from './visibilite';
import { libellesIncoherents, slugLecon } from './catalogue';
import { leconSchema } from './schema';

const l = (publicLecon: string, matiere = 'histoire', ordre = 1, titre = 'T', matiereLibelle = 'Histoire') => ({
  id: `${publicLecon}/${matiere}/${titre}/lecon`,
  data: leconSchema.parse({
    titre, public: publicLecon, matiere, matiereLibelle, ordre, statut: 'publie', sources: [{ libelle: 's' }],
    chapitres: [{ titre: 'c', cartes: [{ motCle: 'm' }] }],
  }),
});

describe('visibilité', () => {
  it('brouillon seulement en aperçu', () => {
    expect(estVisible('brouillon', false)).toBe(false);
    expect(estVisible('brouillon', true)).toBe(true);
    expect(estVisible('publie', false)).toBe(true);
  });
});
describe('catalogue', () => {
  it('libellesIncoherents signale une matière aux libellés différents', () =>
    expect(libellesIncoherents([l('6e', 'histoire', 1, 'a', 'Histoire'), l('5e', 'histoire', 1, 'b', 'Histoire-géo'), l('6e', 'maths', 1, 'c', 'Maths')]))
      .toEqual(['matière « histoire » : libellés différents « Histoire », « Histoire-géo »']));
  it('libellesIncoherents ne dit rien quand tout concorde', () =>
    expect(libellesIncoherents([l('6e', 'histoire', 1, 'a'), l('5e', 'histoire', 1, 'b')])).toEqual([]));
  it('slugLecon', () => expect(slugLecon('6e/histoire/paleolithique/lecon')).toBe('paleolithique'));
});
