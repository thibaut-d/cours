// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages du dépôt public thibaut-d/cours : tout lien interne passe par la base.
export default defineConfig({
  site: 'https://thibaut-d.github.io',
  base: '/cours',
  output: 'static',
});
