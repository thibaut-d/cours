import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { parse } from 'yaml';
import { avertissements } from '../src/lecon/avertissements';
import { libellesIncoherents, type EntreeLecon } from '../src/lecon/catalogue';
import { leconSchema, type Lecon } from '../src/lecon/schema';

const racine = process.env['CONTENU_DIR'] ?? 'contenu';

function trouverLecons(dossier: string): string[] {
  const trouves: string[] = [];
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const chemin = join(dossier, e.name);
    if (e.isDirectory()) trouves.push(...trouverLecons(chemin));
    else if (e.name === 'lecon.yaml') trouves.push(chemin);
  }
  return trouves.sort();
}

function images(lecon: Lecon): string[] {
  const fichiers: string[] = [];
  for (const chap of lecon.chapitres) {
    for (const c of chap.cartes) if (c.image && 'fichier' in c.image) fichiers.push(c.image.fichier);
    for (const q of chap.questions ?? []) if (q.image && 'fichier' in q.image) fichiers.push(q.image.fichier);
  }
  return fichiers;
}

function pictos(lecon: Lecon): string[] {
  return lecon.chapitres.flatMap((chap) => chap.cartes.flatMap((c) => (c.picto ? [c.picto] : [])));
}

if (!existsSync(racine)) {
  console.log(`Aucune leçon : le dossier « ${racine} » n'existe pas.`);
  process.exit(0);
}

const fichiers = trouverLecons(racine);
if (fichiers.length === 0) {
  console.log(`Aucune leçon sous « ${racine} ».`);
  process.exit(0);
}

let erreurs = 0;
let nbAvertissements = 0;
const valides: EntreeLecon[] = [];

for (const fichier of fichiers) {
  const nom = relative(racine, fichier).replaceAll('\\', '/');
  const problemes: string[] = [];
  let conseils: string[] = [];
  try {
    const brut: unknown = parse(readFileSync(fichier, 'utf8'));
    const r = leconSchema.safeParse(brut);
    if (!r.success) {
      for (const i of r.error.issues) problemes.push(`${i.path.join('.') || '(racine)'} : ${i.message}`);
    } else {
      for (const f of images(r.data)) {
        if (!existsSync(join(dirname(fichier), f))) problemes.push(`image introuvable : ${f}`);
      }
      for (const p of pictos(r.data)) {
        if (!existsSync(join('public', 'pictos', `${p}.svg`))) problemes.push(`pictogramme introuvable : public/pictos/${p}.svg`);
      }
      conseils = avertissements(r.data);
      valides.push({ id: nom, data: r.data });
    }
  } catch (e) {
    problemes.push(`lecture impossible : ${(e as Error).message}`);
  }
  erreurs += problemes.length;
  nbAvertissements += conseils.length;
  if (problemes.length === 0 && conseils.length === 0) continue;
  console.log(nom);
  for (const p of problemes) console.log(`  ERREUR : ${p}`);
  for (const a of conseils) console.log(`  avertissement : ${a}`);
}

for (const message of libellesIncoherents(valides)) {
  console.log(`ERREUR : ${message}`);
  erreurs += 1;
}

console.log(`\n${fichiers.length} leçon(s), ${erreurs} erreur(s), ${nbAvertissements} avertissement(s).`);
process.exit(erreurs > 0 ? 1 : 0);
