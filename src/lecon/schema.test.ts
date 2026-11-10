import { describe, expect, it } from 'vitest';
import { leconSchema } from './schema';

const base = {
  titre: 'Vivre au Paléolithique', niveau: '6e', matiere: 'histoire', matiereLibelle: 'Histoire',
  ordre: 1, statut: 'brouillon', sources: [{ libelle: 'Programme de 6e' }],
  chapitres: [{ titre: 'Chasse', cartes: [{ motCle: 'chasser', image: { aGenerer: 'chasseurs et rennes', alt: 'Des chasseurs' } }] }],
};
const avecImage = (etiquettes: unknown) => ({
  ...base,
  chapitres: [{ titre: 'c', cartes: [{ motCle: 'm', image: { aGenerer: 'd', alt: 'a', etiquettes } }] }],
});

describe('leconSchema', () => {
  it('accepte un brouillon avec image à générer', () => expect(leconSchema.safeParse(base).success).toBe(true));
  it('refuse une leçon publiée avec image à générer', () => {
    const r = leconSchema.safeParse({ ...base, statut: 'publie' });
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error)).toContain('image à générer');
  });
  it('refuse une carte vide', () =>
    expect(leconSchema.safeParse({ ...base, chapitres: [{ titre: 'x', cartes: [{}] }] }).success).toBe(false));
  it('refuse une étiquette hors image', () =>
    expect(leconSchema.safeParse(avecImage([{ texte: 't', x: 120, y: 10 }])).success).toBe(false));
  it('refuse une frise qui vise une carte inexistante', () =>
    expect(leconSchema.safeParse({
      ...base,
      chapitres: [{ ...base.chapitres[0], ensemble: { type: 'frise', periodes: [{ libelle: 'a', dates: 'x', carte: 9 }, { libelle: 'b', dates: 'y' }] } }],
    }).success).toBe(false));
  it('accepte une frise qui vise une carte existante', () =>
    expect(leconSchema.safeParse({
      ...base,
      chapitres: [{ ...base.chapitres[0], ensemble: { type: 'frise', periodes: [{ libelle: 'a', dates: 'x', carte: 1 }, { libelle: 'b', dates: 'y' }] } }],
    }).success).toBe(true));
  it('langue par défaut fr', () => expect(leconSchema.parse(base).langue).toBe('fr'));
});
