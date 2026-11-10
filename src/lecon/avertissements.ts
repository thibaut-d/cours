import { NIVEAUX } from './niveaux';
import type { Lecon } from './schema';

export const OBJECTIFS: Record<
  'college' | 'lycee' | 'superieur',
  { cartesMin: number; cartesMax: number; motsParPhraseMax?: number; phrasesMax?: number }
> = {
  college: { cartesMin: 6, cartesMax: 12, motsParPhraseMax: 20, phrasesMax: 1 },
  lycee: { cartesMin: 10, cartesMax: 20, phrasesMax: 2 },
  superieur: { cartesMin: 15, cartesMax: 30 },
};

const mots = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`;

export function avertissements(lecon: Lecon): string[] {
  const cycle = NIVEAUX.find((n) => n.id === lecon.niveau)!.cycle;
  const obj = OBJECTIFS[cycle];
  const messages: string[] = [];

  if (mots(lecon.titre) > 6) {
    messages.push(`Titre : ${mots(lecon.titre)} mots, 6 au plus sont conseillés.`);
  }
  for (const chap of lecon.chapitres) {
    const n = chap.cartes.length;
    if (n < obj.cartesMin || n > obj.cartesMax) {
      messages.push(`${chap.titre} : ${pluriel(n, 'carte')}, entre ${obj.cartesMin} et ${obj.cartesMax} sont conseillées.`);
    }
    if (mots(chap.titre) > 6) {
      messages.push(`${chap.titre} : titre de ${mots(chap.titre)} mots, 6 au plus sont conseillés.`);
    }
    chap.cartes.forEach((c, i) => {
      const phrases = c.phrases ?? [];
      if (obj.phrasesMax !== undefined && phrases.length > obj.phrasesMax) {
        messages.push(`${chap.titre} : carte ${i + 1}, ${pluriel(phrases.length, 'phrase')}, ${obj.phrasesMax} au plus sont conseillées.`);
      }
      if (obj.motsParPhraseMax !== undefined) {
        for (const p of phrases) {
          if (mots(p) > obj.motsParPhraseMax) {
            messages.push(`${chap.titre} : carte ${i + 1}, phrase de ${mots(p)} mots, ${obj.motsParPhraseMax} au plus sont conseillés.`);
          }
        }
      }
    });
  }
  return messages;
}
