import { afterEach, describe, expect, it } from 'vitest';
import { resoudreImage } from './images';

const avant = process.env['CONTENU_DIR'];
afterEach(() => {
  if (avant === undefined) delete process.env['CONTENU_DIR'];
  else process.env['CONTENU_DIR'] = avant;
});

describe('resoudreImage', () => {
  it("trouve l'image d'une leçon d'essai", () => {
    process.env['CONTENU_DIR'] = 'e2e/contenu-test';
    expect(resoudreImage('6e/histoire/essai-publie/lecon', 'essai.webp')).toBeTruthy();
  });
  it('accepte un chemin en ./', () => {
    process.env['CONTENU_DIR'] = './e2e/contenu-test/';
    expect(resoudreImage('6e/histoire/essai-publie/lecon', './essai.webp')).toBeTruthy();
  });
  it('erreur explicite, avec la leçon et le fichier, si absente', () => {
    process.env['CONTENU_DIR'] = 'e2e/contenu-test';
    expect(() => resoudreImage('6e/histoire/essai-publie/lecon', 'absente.webp')).toThrow(
      /6e\/histoire\/essai-publie.*absente\.webp/,
    );
  });
});
