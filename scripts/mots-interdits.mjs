// Détection de termes interdits (vie privée). Fonctions pures, sans accès disque.

const METACARACTERES = /[\\^$.*+?()[\]{}|]/;
const METACARACTERES_GLOBAL = /[\\^$.*+?()[\]{}|]/g;

/** Une ligne = un motif. Lignes vides et commentaires (#) ignorés. */
export function chargerMotifs(texte) {
  return texte
    .split(/\r?\n/)
    .map((l) => l.normalize('NFC').trim())
    .filter((l) => l !== '' && !l.startsWith('#'))
    .map((l) => {
      // \b de JS ignore les lettres accentuées : bornes Unicode explicites pour les termes simples.
      const source = METACARACTERES.test(l)
        ? l
        : `(?<![\\p{L}\\p{N}_])${l.replace(METACARACTERES_GLOBAL, '\\$&')}(?![\\p{L}\\p{N}_])`;
      return new RegExp(source, 'iu');
    });
}

/** Renvoie les lignes du texte où au moins un motif apparaît. */
export function trouverMotsInterdits(texte, motifs) {
  const trouves = [];
  texte.normalize('NFC').split(/\r?\n/).forEach((extrait, i) => {
    if (motifs.some((m) => m.test(extrait))) trouves.push({ ligne: i + 1, extrait });
  });
  return trouves;
}
