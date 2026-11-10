import { z } from 'zod';
import { IDS_NIVEAUX } from './niveaux';

const slug = z.string().regex(/^[a-z0-9-]+$/);
const texte = z.string().min(1);

const etiquette = z.object({
  texte: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

const imageFichier = z.object({
  fichier: z.string().min(1), // chemin relatif au dossier de la leçon
  alt: texte,
  credit: z.union([
    z.literal('generee'),
    z.object({ auteur: z.string(), licence: z.string(), url: z.string() }),
  ]),
  etiquettes: z.array(etiquette).optional(),
});

const imageAGenerer = z.object({
  aGenerer: texte,
  alt: texte,
  etiquettes: z.array(etiquette).optional(),
});

const image = z.union([imageFichier, imageAGenerer]);

const carte = z
  .object({
    picto: slug.optional(),
    motCle: z.string().optional(),
    phrases: z.array(z.string()).optional(),
    points: z.array(z.string()).optional(),
    formule: z.string().optional(),
    enSavoirPlus: z.string().optional(),
    notes: z.string().optional(),
    image: image.optional(),
  })
  .refine((c) => c.image || c.motCle || c.phrases || c.points || c.formule, {
    message: 'Une carte doit avoir au moins une image, un mot-clé, des phrases, des points ou une formule.',
  });

const ensemble = z.union([
  z.object({ type: z.literal('mosaique') }),
  z.object({
    type: z.literal('frise'),
    periodes: z
      .array(z.object({ libelle: z.string(), dates: z.string(), carte: z.number().int().min(1).optional() }))
      .min(2),
  }),
]);

const chapitre = z.object({
  titre: z.string(),
  cartes: z.array(carte).min(1),
  ensemble: ensemble.optional(),
  formule: z.string().optional(),
  questions: z.array(z.object({ question: z.string(), reponse: z.string(), image: image.optional() })).optional(),
});

export const leconSchema = z
  .object({
    titre: texte,
    niveau: z.enum(IDS_NIVEAUX),
    matiere: slug,
    matiereLibelle: z.string(),
    ordre: z.number().int().min(1),
    langue: z.enum(['fr', 'en']).default('fr'),
    statut: z.enum(['brouillon', 'publie']),
    resume: z.string().optional(),
    sources: z.array(z.object({ libelle: z.string(), url: z.url().optional() })).min(1),
    chapitres: z.array(chapitre).min(1),
  })
  .superRefine((lecon, ctx) => {
    lecon.chapitres.forEach((chap, ic) => {
      chap.cartes.forEach((c, i) => {
        if (lecon.statut === 'publie' && c.image && 'aGenerer' in c.image) {
          ctx.addIssue({
            code: 'custom',
            message: `image à générer dans une leçon publiée (chapitre « ${chap.titre} », carte ${i + 1})`,
            path: ['chapitres', ic, 'cartes', i, 'image'],
          });
        }
      });
      chap.questions?.forEach((q, i) => {
        if (lecon.statut === 'publie' && q.image && 'aGenerer' in q.image) {
          ctx.addIssue({
            code: 'custom',
            message: `image à générer dans une leçon publiée (chapitre « ${chap.titre} », question ${i + 1})`,
            path: ['chapitres', ic, 'questions', i, 'image'],
          });
        }
      });
      if (chap.ensemble?.type === 'frise') {
        chap.ensemble.periodes.forEach((p, i) => {
          if (p.carte !== undefined && p.carte > chap.cartes.length) {
            ctx.addIssue({
              code: 'custom',
              message: `la période « ${p.libelle} » vise la carte ${p.carte}, qui n'existe pas (le chapitre « ${chap.titre} » en a ${chap.cartes.length})`,
              path: ['chapitres', ic, 'ensemble', 'periodes', i, 'carte'],
            });
          }
        });
      }
    });
  });

export type Lecon = z.infer<typeof leconSchema>;
