// Filtres de l'accueil : choix lus dans l'adresse (prioritaire) ou la mémoire du navigateur, appliqués aux
// tuiles, puis réécrits dans l'adresse et la mémoire à chaque clic. Tout accès au stockage est protégé :
// stockage bloqué, les filtres marchent sans mémoire.
import { ecrireAdresse, estMontree, lireAdresse, nettoyer, type Filtres } from '../lecon/filtres';
import type { PublicId } from '../lecon/publics';

const CLE = 'cours-filtres';

function lireStockage(): Filtres | null {
  try {
    const brut: unknown = JSON.parse(localStorage.getItem(CLE) ?? 'null');
    if (typeof brut !== 'object' || brut === null) return null;
    const liste = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
    const { publics, matieres } = brut as Record<string, unknown>;
    return { publics: liste(publics), matieres: liste(matieres) };
  } catch {
    return null;
  }
}

function ecrireStockage(f: Filtres): void {
  try {
    localStorage.setItem(CLE, JSON.stringify(f));
  } catch {
    /* ignoré */
  }
}

export function activerFiltres(): void {
  const bloc = document.querySelector<HTMLElement>('.filtres');
  if (!bloc) return; // aucune leçon publiée
  const boutons = [...bloc.querySelectorAll<HTMLButtonElement>('button[data-filtre]')];
  const valeurs = (nom: 'public' | 'matiere') =>
    boutons.filter((b) => b.dataset.filtre === nom).map((b) => b.dataset.valeur ?? '');
  const connus = { publics: valeurs('public'), matieres: valeurs('matiere') };
  const tuiles = [...document.querySelectorAll<HTMLElement>('li[data-matiere]')];
  const groupes = [...document.querySelectorAll<HTMLElement>('[data-groupe]')];
  const message = document.querySelector<HTMLElement>('[data-message-vide]');
  const toutVoir = bloc.querySelector<HTMLButtonElement>('[data-tout-voir]');

  // Garde l'ordre des boutons, pour une adresse stable.
  const ranger = (f: Filtres): Filtres => ({
    publics: connus.publics.filter((v) => f.publics.includes(v)),
    matieres: connus.matieres.filter((v) => f.matieres.includes(v)),
  });

  let filtres = ranger(nettoyer(lireAdresse(location.search) ?? lireStockage() ?? { publics: [], matieres: [] }, connus.publics, connus.matieres));

  function appliquer(): void {
    for (const b of boutons) {
      const liste = b.dataset.filtre === 'public' ? filtres.publics : filtres.matieres;
      b.setAttribute('aria-pressed', String(liste.includes(b.dataset.valeur ?? '')));
    }
    for (const t of tuiles) {
      t.hidden = !estMontree({ public: t.dataset.public as PublicId, matiere: t.dataset.matiere ?? '' }, filtres);
    }
    for (const g of groupes) g.hidden = !g.querySelector('li[data-matiere]:not([hidden])');
    if (message) message.hidden = !tuiles.every((t) => t.hidden);
  }

  function enregistrer(): void {
    ecrireStockage(filtres);
    history.replaceState(history.state, '', `${location.pathname}${ecrireAdresse(filtres)}${location.hash}`);
  }

  function changer(nouveaux: Filtres): void {
    filtres = ranger(nouveaux);
    appliquer();
    enregistrer();
  }

  for (const b of boutons) {
    b.addEventListener('click', () => {
      const cle = b.dataset.filtre === 'public' ? 'publics' : 'matieres';
      const valeur = b.dataset.valeur ?? '';
      const liste = filtres[cle].includes(valeur) ? filtres[cle].filter((v) => v !== valeur) : [...filtres[cle], valeur];
      changer({ ...filtres, [cle]: liste });
    });
  }
  toutVoir?.addEventListener('click', () => changer({ publics: [], matieres: [] }));

  appliquer();
  enregistrer();
  bloc.hidden = false;
}
