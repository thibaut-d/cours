import { describe, expect, it } from 'vitest';
import { lien } from './lien';

// BASE_URL vaut '/cours/' (vitest.config.ts : define).
describe('lien', () => {
  it('préfixe la base', () => expect(lien('/6e/')).toBe('/cours/6e/'));
  it('accepte un chemin sans barre initiale', () => expect(lien('6e/histoire/')).toBe('/cours/6e/histoire/'));
  it('racine', () => expect(lien('/')).toBe('/cours/'));
});
