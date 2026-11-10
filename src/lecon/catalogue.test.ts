import { describe, expect, it } from 'vitest';
import { estVisible } from './visibilite';
import { leconsDeMatiere, matieresDuNiveau, niveauxPresents, slugLecon } from './catalogue';
import { leconSchema } from './schema';

const l = (niveau: string, matiere = 'histoire', ordre = 1, titre = 'T', matiereLibelle = 'Histoire') => ({
  id: `${niveau}/${matiere}/${titre}/lecon`,
  data: leconSchema.parse({
    titre, niveau, matiere, matiereLibelle, ordre, statut: 'publie', sources: [{ libelle: 's' }],
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
  it('niveauxPresents suit l’ordre officiel', () =>
    expect(niveauxPresents([l('sup'), l('6e')]).map((n) => n.id)).toEqual(['6e', 'sup']));
  it('leconsDeMatiere trie par ordre', () =>
    expect(leconsDeMatiere([l('6e', 'histoire', 2, 'B'), l('6e', 'histoire', 1, 'Z')], '6e', 'histoire').map((x) => x.data.ordre)).toEqual([1, 2]));
  it('matieresDuNiveau trie par libellé sans doublon', () =>
    expect(matieresDuNiveau([l('6e', 'maths', 1, 'a', 'Mathématiques'), l('6e', 'histoire', 1, 'b'), l('6e', 'histoire', 2, 'c'), l('5e', 'svt', 1, 'd', 'SVT')], '6e')
      .map((m) => m.matiere)).toEqual(['histoire', 'maths']));
  it('slugLecon', () => expect(slugLecon('6e/histoire/paleolithique/lecon')).toBe('paleolithique'));
});
