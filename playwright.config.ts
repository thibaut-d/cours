import { defineConfig, devices } from '@playwright/test';

// Tests de bout en bout sur le site construit (`astro preview` sert `dist/`).
// 127.0.0.1 plutôt que localhost : sous Windows, localhost peut résoudre en IPv6 alors que preview écoute en IPv4.
export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // `--ignore-lock` : Astro 7 met `preview` en arrière-plan quand il détecte un agent (Claude Code…)
  // et Playwright croit alors le serveur mort ; ce drapeau force le premier plan.
  webServer: { command: 'pnpm build:essai && pnpm preview --host 127.0.0.1 --port 4321 --ignore-lock', url: 'http://127.0.0.1:4321/cours/', reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://127.0.0.1:4321', locale: 'fr-FR' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } }],
});
