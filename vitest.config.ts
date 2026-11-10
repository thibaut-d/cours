import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Même base que astro.config.mjs : lien() lit import.meta.env.BASE_URL, que Vite tire de `base`.
  base: '/cours/',
  test: { environment: 'node', include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'] },
});
