import { describe, expect, it } from 'vitest';
import {
  boutonsMatieres, boutonsPublics, ecrireAdresse, estMontree, grouperParMatiere, lireAdresse, nettoyer,
  publicsCorrespondants,
} from './filtres';
import { leconSchema } from './schema';

const l = (publicLecon: string, matiere = 'histoire', ordre = 1, titre = 'T', matiereLibelle = 'Histoire') => ({
  id: `${publicLecon}/${matiere}/${titre}/lecon`,
  data: leconSchema.parse({
    titre, public: publicLecon, matiere, matiereLibelle, ordre, statut: 'publie', sources: [{ libelle: 's' }],
    chapitres: [{ titre: 'c', cartes: [{ motCle: 'm' }] }],
  }),
});

describe('publicsCorrespondants', () => {
  it('une classe : elle-même et son cycle', () => expect(publicsCorrespondants('6e')).toEqual(['6e', 'college']));
  it('un cycle : lui-même et ses classes', () =>
    expect(publicsCorrespondants('college')).toEqual(['college', '6e', '5e', '4e', '3e']));
  it('un public à part : lui-même', () => expect(publicsCorrespondants('professeurs')).toEqual(['professeurs']));
  it('le supérieur n’a pas de classes', () => expect(publicsCorrespondants('superieur')).toEqual(['superieur']));
});

describe('boutonsPublics', () => {
  it('une leçon de collège donne le collège et ses classes, dans l’ordre', () =>
    expect(boutonsPublics([l('college')]).map((b) => b.id)).toEqual(['college', '6e', '5e', '4e', '3e']));
  it('porte le libellé', () => expect(boutonsPublics([l('tle')])[1]).toEqual({ id: 'tle', libelle: 'Terminale' }));
});

describe('boutonsMatieres', () => {
  it('trie par libellé sans doublon', () =>
    expect(boutonsMatieres([l('6e', 'maths', 1, 'a', 'Mathématiques'), l('6e', 'histoire', 1, 'b'), l('5e', 'histoire', 1, 'c')]))
      .toEqual([{ matiere: 'histoire', libelle: 'Histoire' }, { matiere: 'maths', libelle: 'Mathématiques' }]));
});

describe('estMontree', () => {
  const cours = { public: 'college', matiere: 'histoire' } as const;
  it('sans filtre', () => expect(estMontree(cours, { publics: [], matieres: [] })).toBe(true));
  it('une classe du cycle', () => expect(estMontree(cours, { publics: ['6e'], matieres: [] })).toBe(true));
  it('un autre cycle', () => expect(estMontree(cours, { publics: ['lycee'], matieres: [] })).toBe(false));
  it('une autre matière', () => expect(estMontree(cours, { publics: [], matieres: ['svt'] })).toBe(false));
  it('public et matière combinés', () =>
    expect(estMontree(cours, { publics: ['6e'], matieres: ['histoire'] })).toBe(true));
});

describe('adresse', () => {
  it('lit les valeurs séparées par des virgules', () =>
    expect(lireAdresse('?public=6e,xyz&matiere=')).toEqual({ publics: ['6e', 'xyz'], matieres: [] }));
  it('null sans paramètre', () => expect(lireAdresse('')).toBeNull());
  it('écrit rien sans filtre', () => expect(ecrireAdresse({ publics: [], matieres: [] })).toBe(''));
  it('omet le paramètre vide', () => expect(ecrireAdresse({ publics: ['6e'], matieres: [] })).toBe('?public=6e'));
  it('aller-retour', () => {
    const f = { publics: ['6e', '5e'], matieres: ['histoire'] };
    expect(lireAdresse(ecrireAdresse(f))).toEqual(f);
  });
});

describe('nettoyer', () => {
  it('retire les valeurs inconnues et les doublons', () =>
    expect(nettoyer({ publics: ['6e', 'xyz', '6e'], matieres: ['svt', 'histoire'] }, ['6e', '5e'], ['histoire']))
      .toEqual({ publics: ['6e'], matieres: ['histoire'] }));
});

describe('grouperParMatiere', () => {
  it('groupes triés par libellé ; ordre de PUBLICS (collège, 6e, 2de), puis ordre, puis titre', () => {
    const g = grouperParMatiere([
      l('2de', 'histoire', 1, 'D'), l('6e', 'histoire', 2, 'B'), l('college', 'histoire', 1, 'C'),
      l('6e', 'histoire', 1, 'Z'), l('6e', 'histoire', 1, 'A'), l('6e', 'maths', 1, 'M', 'Mathématiques'),
    ]);
    expect(g.map((x) => x.matiere)).toEqual(['histoire', 'maths']);
    expect(g[0]!.libelle).toBe('Histoire');
    expect(g[0]!.lecons.map((x) => x.data.titre)).toEqual(['C', 'A', 'Z', 'B', 'D']);
  });
});
