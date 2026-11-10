// Refuse un commit qui contient un terme listé dans prive/mots-interdits.txt (fichier non versionné).
// Usage : --index | --message <fichier> | --stdin
// La sortie donne `chemin:ligne`, jamais le mot trouvé.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { chargerMotifs, trouverMotsInterdits } from './mots-interdits.mjs';

const LISTE = 'prive/mots-interdits.txt';
const IGNORES = new Set(['pnpm-lock.yaml']);

if (!existsSync(LISTE)) {
  console.warn(`Avertissement : ${LISTE} est absent, aucune vérification de vie privée.`);
  process.exit(0);
}
const motifs = chargerMotifs(readFileSync(LISTE, 'utf8'));

const sources = []; // { nom, texte }
const [mode, arg] = process.argv.slice(2);
if (mode === '--index') {
  const noms = execFileSync('git', ['diff', '--cached', '--name-only', '--no-renames', '--diff-filter=ACM', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter(Boolean);
  for (const nom of noms) {
    if (IGNORES.has(nom.split('/').pop())) continue;
    const contenu = execFileSync('git', ['show', `:${nom}`], { maxBuffer: 256 * 1024 * 1024 });
    if (contenu.includes(0)) continue; // binaire : polices, images
    sources.push({ nom, texte: contenu.toString('utf8') });
  }
} else if (mode === '--message' && arg) {
  sources.push({ nom: arg, texte: readFileSync(arg, 'utf8') });
} else if (mode === '--stdin') {
  sources.push({ nom: 'stdin', texte: readFileSync(0, 'utf8') });
} else {
  console.error('Usage : verifier-prive.mjs --index | --message <fichier> | --stdin');
  process.exit(2);
}

let trouve = false;
for (const { nom, texte } of sources) {
  for (const { ligne } of trouverMotsInterdits(texte, motifs)) {
    console.error(`${nom}:${ligne}`);
    trouve = true;
  }
}
if (trouve) {
  console.error('Commit refusé : un terme de prive/mots-interdits.txt apparaît aux emplacements ci-dessus.');
  process.exit(1);
}
