import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { leconSchema } from './lecon/schema';

export const collections = {
  lecons: defineCollection({
    loader: glob({ pattern: '**/lecon.yaml', base: process.env['CONTENU_DIR'] ?? './contenu' }),
    schema: leconSchema,
  }),
};
