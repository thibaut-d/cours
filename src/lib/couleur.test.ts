import { describe, expect, it } from 'vitest';
import { couleurDuRang } from './couleur';

describe('couleurDuRang', () => {
  it('suit le rang', () => expect(couleurDuRang(1)).toBe('var(--palette-1)'));
  it('reboucle après 6', () => {
    expect(couleurDuRang(6)).toBe('var(--palette-6)');
    expect(couleurDuRang(7)).toBe('var(--palette-1)');
  });
});
