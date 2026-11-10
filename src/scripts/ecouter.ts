import { lireReglages } from './reglages';

// Un bouton « Écouter » par carte, ajouté seulement si le navigateur sait lire à voix haute.
export function activerEcouter(racine: ParentNode = document): void {
  if (!('speechSynthesis' in window)) return;
  const modele = racine.querySelector<HTMLTemplateElement>('template[data-ecouter]');
  if (!modele) return;
  const synthese = window.speechSynthesis;
  const langue = document.documentElement.lang.startsWith('en') ? 'en-GB' : 'fr-FR';
  const libEcouter = modele.dataset.libEcouter ?? 'Écouter';
  const libArreter = modele.dataset.libArreter ?? 'Arrêter';

  let actif: { bouton: HTMLButtonElement; paroles: SpeechSynthesisUtterance } | null = null;

  const etat = (bouton: HTMLButtonElement, enCours: boolean) => {
    bouton.setAttribute('aria-pressed', String(enCours));
    const mot = bouton.querySelector('.mot');
    if (mot) mot.textContent = enCours ? libArreter : libEcouter;
  };

  const arreter = () => {
    const ancien = actif;
    actif = null;
    synthese.cancel();
    if (ancien) etat(ancien.bouton, false);
  };

  for (const carte of racine.querySelectorAll<HTMLElement>('article.carte[data-texte]')) {
    const fragment = modele.content.cloneNode(true) as DocumentFragment;
    const bouton = fragment.querySelector<HTMLButtonElement>('button');
    if (!bouton) continue;
    const compteur = carte.querySelector('.compteur');
    if (compteur) compteur.after(bouton);
    else carte.prepend(bouton);

    bouton.addEventListener('click', () => {
      if (actif?.bouton === bouton) {
        arreter();
        return;
      }
      arreter();
      const paroles = new SpeechSynthesisUtterance(carte.dataset.texte ?? '');
      paroles.lang = langue;
      paroles.rate = lireReglages().vitesse;
      const fin = () => {
        if (actif?.paroles === paroles) {
          actif = null;
          etat(bouton, false);
        }
      };
      paroles.onend = fin;
      paroles.onerror = fin;
      actif = { bouton, paroles };
      etat(bouton, true);
      synthese.speak(paroles);
    });
  }
  window.addEventListener('pagehide', () => synthese.cancel());
}
