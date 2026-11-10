import { getCollection } from 'astro:content';
import { estVisible, modeApercu } from '../lecon/visibilite';
import type { Lecon } from '../lecon/schema';

// Seule porte d'accès aux leçons : les brouillons n'en sortent qu'en mode aperçu.
export async function leconsVisibles(): Promise<{ id: string; data: Lecon }[]> {
  const apercu = modeApercu();
  const toutes = await getCollection('lecons');
  return toutes.filter((l) => estVisible(l.data.statut, apercu));
}
