// Réglages de lecture : lus et écrits dans localStorage (clé `cours-reglages`), jamais bloquants.
export interface Reglages {
  taille: 'normale' | 'grande' | 'tres-grande';
  espacement: 'normal' | 'aere';
  fond: 'creme' | 'blanc';
  vitesse: 0.8 | 1 | 1.2;
}

export const CLE = 'cours-reglages';
export const PAR_DEFAUT: Reglages = { taille: 'normale', espacement: 'normal', fond: 'creme', vitesse: 1 };

export function lireReglages(): Reglages {
  const r: Reglages = { ...PAR_DEFAUT };
  try {
    const s = JSON.parse(localStorage.getItem(CLE) ?? '{}') as Partial<Record<keyof Reglages, unknown>>;
    if (s.taille === 'grande' || s.taille === 'tres-grande') r.taille = s.taille;
    if (s.espacement === 'aere') r.espacement = 'aere';
    if (s.fond === 'blanc') r.fond = 'blanc';
    if (s.vitesse === 0.8 || s.vitesse === 1.2) r.vitesse = s.vitesse;
  } catch {
    /* stockage absent ou illisible : valeurs par défaut */
  }
  return r;
}

export function ecrireReglages(r: Reglages): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(r));
  } catch {
    /* stockage bloqué : le réglage s'applique quand même à la page */
  }
}

export function appliquer(r: Reglages, html: HTMLElement = document.documentElement): void {
  const poser = (nom: string, defaut: boolean, valeur: string) =>
    defaut ? html.removeAttribute(nom) : html.setAttribute(nom, valeur);
  poser('data-taille', r.taille === 'normale', r.taille);
  poser('data-espacement', r.espacement === 'normal', r.espacement);
  poser('data-fond', r.fond === 'creme', r.fond);
}

export function activerReglages(): void {
  const bouton = document.querySelector<HTMLButtonElement>('.btn-reglages');
  const boite = document.querySelector<HTMLDialogElement>('#reglages');
  if (!bouton || !boite || typeof boite.showModal !== 'function') return;

  let courant = lireReglages();
  appliquer(courant);
  for (const radio of boite.querySelectorAll<HTMLInputElement>('input[type=radio]')) {
    radio.checked = String(courant[radio.name as keyof Reglages]) === radio.value;
  }

  boite.addEventListener('change', (e) => {
    const radio = e.target as HTMLInputElement;
    if (radio.type !== 'radio') return;
    const valeur = radio.name === 'vitesse' ? Number(radio.value) : radio.value;
    courant = { ...courant, [radio.name]: valeur } as Reglages;
    ecrireReglages(courant);
    appliquer(courant);
  });

  bouton.hidden = false;
  bouton.addEventListener('click', () => boite.showModal());
  boite.querySelector('.fermer-reglages')?.addEventListener('click', () => boite.close());
  // Un appui hors du panneau le ferme.
  boite.addEventListener('click', (e) => {
    if (e.target === boite) boite.close();
  });
  boite.addEventListener('close', () => bouton.focus());
}
