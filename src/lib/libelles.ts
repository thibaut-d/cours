// Libellés de l'interface d'une fiche, dans la langue de la leçon.
export type Langue = 'fr' | 'en';

const LIBELLES = {
  fr: {
    questions: 'Questions qui peuvent tomber',
    cacherReponses: 'Cacher les réponses',
    voirReponse: 'Voir la réponse',
    enSavoirPlus: 'En savoir plus',
    imageGeneree: 'Image générée',
    imageAGenerer: 'IMAGE À GÉNÉRER',
    sources: 'Sources',
    ensemble: "VUE D'ENSEMBLE",
    formule: 'À RETENIR',
    carte: 'Carte',
  },
  en: {
    questions: 'Likely exam questions',
    cacherReponses: 'Hide answers',
    voirReponse: 'Show answer',
    enSavoirPlus: 'Learn more',
    imageGeneree: 'Generated image',
    imageAGenerer: 'IMAGE TO GENERATE',
    sources: 'Sources',
    ensemble: 'OVERVIEW',
    formule: 'KEY IDEA',
    carte: 'Card',
  },
} as const satisfies Record<Langue, Record<string, string>>;

export type Libelles = (typeof LIBELLES)[Langue];

export function libelles(langue: Langue): Libelles {
  return LIBELLES[langue];
}
