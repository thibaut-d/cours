// « Cacher les réponses » : masque toutes les réponses d'une section, et un bouton « Voir la réponse »
// sous chaque question les dévoile une par une. Rien n'est enregistré.
export function activerQuestions(racine: ParentNode = document): void {
  for (const section of racine.querySelectorAll<HTMLElement>('section.questions')) {
    const bascule = section.querySelector<HTMLButtonElement>('.cacher-reponses');
    if (!bascule) continue;
    const items = [...section.querySelectorAll<HTMLElement>('.question')];

    const afficher = (item: HTMLElement, visible: boolean) => {
      const reponse = item.querySelector<HTMLElement>('.reponse');
      const voir = item.querySelector<HTMLButtonElement>('.voir-reponse');
      if (reponse) reponse.hidden = !visible;
      if (voir) voir.hidden = visible;
    };

    bascule.hidden = false;
    bascule.addEventListener('click', () => {
      const cacher = bascule.getAttribute('aria-pressed') !== 'true';
      bascule.setAttribute('aria-pressed', String(cacher));
      for (const item of items) afficher(item, !cacher);
    });

    for (const item of items) {
      item.querySelector<HTMLButtonElement>('.voir-reponse')?.addEventListener('click', () => {
        afficher(item, true);
        const reponse = item.querySelector<HTMLElement>('.reponse');
        if (reponse) {
          reponse.tabIndex = -1;
          reponse.focus();
        }
      });
    }
  }
}
