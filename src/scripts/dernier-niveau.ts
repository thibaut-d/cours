// Mémorise le dernier niveau consulté (clé `cours-niveau`). Tout accès au stockage est protégé :
// stockage bloqué ou indisponible, le site reste utilisable.
const CLE = 'cours-niveau';

export function lireNiveau(): string | null {
  try {
    return localStorage.getItem(CLE);
  } catch {
    return null;
  }
}

export function ecrireNiveau(id: string): void {
  try {
    localStorage.setItem(CLE, id);
  } catch {
    /* ignoré */
  }
}

// Accueil : redirige vers le dernier niveau s'il figure dans la liste affichée, sauf si `?choisir`.
export function redirigerVersDernierNiveau(ids: string[], destination: (id: string) => string): void {
  if (new URLSearchParams(location.search).has('choisir')) return;
  const id = lireNiveau();
  if (id && ids.includes(id)) location.replace(destination(id));
}
