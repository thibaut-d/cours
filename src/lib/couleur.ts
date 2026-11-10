// Couleur d'une carte selon son rang dans le chapitre : palette remplaçable de 6 teintes, aucun sens figé.
export const TAILLE_PALETTE = 6;

export function couleurDuRang(rang: number): string {
  return `var(--palette-${((rang - 1) % TAILLE_PALETTE) + 1})`;
}
