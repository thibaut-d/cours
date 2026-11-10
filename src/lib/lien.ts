// Préfixe la base du site (`/cours/`) : tout lien interne passe par ici.
export function lien(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${chemin.replace(/^\/+/, '')}`;
}
