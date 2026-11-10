// Lu en ligne dans <head>, avant le premier affichage : pas de saut de mise en page.
// Du JavaScript simple (pas de types) : le fichier est inséré tel quel dans la page.
(function () {
  try {
    var r = JSON.parse(localStorage.getItem('cours-reglages') || '{}');
    var h = document.documentElement;
    if (['grande', 'tres-grande'].indexOf(r.taille) >= 0) h.setAttribute('data-taille', r.taille);
    if (r.espacement === 'aere') h.setAttribute('data-espacement', 'aere');
    if (r.fond === 'blanc') h.setAttribute('data-fond', 'blanc');
  } catch (e) {
    /* stockage absent ou illisible : valeurs par défaut */
  }
})();
