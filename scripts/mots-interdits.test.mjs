import { describe, expect, it } from 'vitest';
import { chargerMotifs, trouverMotsInterdits } from './mots-interdits.mjs';

describe('mots interdits', () => {
  const m = chargerMotifs('# commentaire\nmot secret\n\n\\bXZ\\b');

  it('ignore les commentaires et les lignes vides', () => {
    expect(m).toHaveLength(2);
  });

  it('trouve un mot sans tenir compte de la casse, avec son numéro de ligne', () => {
    expect(trouverMotsInterdits('ligne 1\nUn Mot Secret ici', m)).toEqual([
      { ligne: 2, extrait: 'Un Mot Secret ici' },
    ]);
  });

  it("n'attrape pas un mot plus long", () => {
    expect(trouverMotsInterdits('un xzylophone', m)).toEqual([]);
  });

  it('borne correctement un terme qui finit ou commence par une lettre accentuée', () => {
    const a = chargerMotifs('Zorbé\nÉlbor');
    expect(trouverMotsInterdits('chez Zorbé ici', a)).toHaveLength(1);
    expect(trouverMotsInterdits('chez zorbé, puis Élbor.', a)).toHaveLength(1);
    expect(trouverMotsInterdits('Zorbé', a)).toHaveLength(1);
    expect(trouverMotsInterdits('Élbor', a)).toHaveLength(1);
    expect(trouverMotsInterdits('un Zorbéen et un Pélbor', a)).toEqual([]);
    expect(trouverMotsInterdits('Zorbés', a)).toEqual([]);
  });

  it('attrape le code isolé', () => {
    expect(trouverMotsInterdits('le code XZ', m)).toHaveLength(1);
  });
});
