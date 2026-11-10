// Détection de termes interdits (vie privée). Fonctions pures, sans accès disque.

const METACARACTERES = /[\\^$.*+?()[\]{}|]/;
const METACARACTERES_GLOBAL = /[\\^$.*+?()[\]{}|]/g;

/** Une ligne = un motif. Lignes vides et commentaires (#) ignorés. */
export function chargerMotifs(texte) {
  return texte
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('#'))
    .map((l) => {
      const source = METACARACTERES.test(l) ? l : `\\b${l.replace(METACARACTERES_GLOBAL, '\\$&')}\\b`;
      return new RegExp(source, 'i');
    });
}

/** Renvoie les lignes du texte où au moins un motif apparaît. */
export function trouverMotsInterdits(texte, motifs) {
  const trouves = [];
  texte.split(/\r?\n/).forEach((extrait, i) => {
    if (motifs.some((m) => m.test(extrait))) trouves.push({ ligne: i + 1, extrait });
  });
  return trouves;
}
