import type { ImageMetadata } from 'astro';

type Module = { default: ImageMetadata };

// Vite n'accepte que des littéraux dans `import.meta.glob` : un glob par dossier de contenu possible,
// puis on choisit selon CONTENU_DIR (défaut `contenu`). Les images d'essai, peu nombreuses et légères,
// sont donc aussi vues par la construction réelle.
const contenu = import.meta.glob<Module>('/contenu/**/*.{webp,png,jpg,jpeg}', { eager: true });
const essai = import.meta.glob<Module>('/e2e/contenu-test/**/*.{webp,png,jpg,jpeg}', { eager: true });

function normaliser(chemin: string): string {
  const segments: string[] = [];
  for (const s of chemin.replace(/\\/g, '/').split('/')) {
    if (s === '' || s === '.') continue;
    if (s === '..') segments.pop();
    else segments.push(s);
  }
  return segments.join('/');
}

// `idLecon` est l'identifiant de l'entrée de collection (ex. `6e/histoire/paleolithique/lecon`) ;
// `fichier` est relatif au dossier de la leçon.
export function resoudreImage(idLecon: string, fichier: string): ImageMetadata {
  const dossier = normaliser(process.env['CONTENU_DIR'] ?? 'contenu');
  const modules = dossier === 'e2e/contenu-test' ? essai : contenu;
  const dossierLecon = idLecon.split('/').slice(0, -1).join('/');
  const cle = '/' + normaliser(`${dossier}/${dossierLecon}/${fichier}`);
  const module = modules[cle];
  if (!module) {
    throw new Error(`Image introuvable pour la leçon « ${dossierLecon} » : « ${fichier} » (cherchée en ${cle}).`);
  }
  return module.default;
}
