import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const url = '/cours/6e/histoire/essai-publie/';

test('réglages appliqués et retenus', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: 'Réglages' }).click();
  await page.getByRole('radio', { name: 'Aéré' }).check();
  await expect(page.locator('html')).toHaveAttribute('data-espacement', 'aere');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-espacement', 'aere');
});

test('réglages : taille, fond, accessibilité du panneau ouvert', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: 'Réglages' }).click();
  await page.getByRole('radio', { name: 'Très grande' }).check();
  await page.getByRole('radio', { name: 'Blanc' }).check();
  await expect(page.locator('html')).toHaveAttribute('data-taille', 'tres-grande');
  await expect(page.locator('html')).toHaveAttribute('data-fond', 'blanc');
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
});

test('le bouton Réglages est sur chaque page', async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.getByRole('button', { name: 'Réglages' })).toBeVisible();
});

test('écouter lit le texte de la carte', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__lu = [];
    window.speechSynthesis.speak = (u: any) => (window as any).__lu.push([u.text, u.lang]);
  });
  await page.goto(url);
  await page.getByRole('button', { name: 'Écouter' }).first().click();
  const [[texte, langue]] = await page.evaluate(() => (window as any).__lu);
  expect(texte).toContain('anthropologiquement');
  expect(langue).toBe('fr-FR');
  await expect(page.getByRole('button', { name: 'Arrêter' })).toHaveAttribute('aria-pressed', 'true');
});

test('écouter une leçon en anglais : en-GB', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__lu = [];
    window.speechSynthesis.speak = (u: any) => (window as any).__lu.push([u.text, u.lang]);
  });
  await page.goto('/cours/superieur/data-sciences/essai-anglais/');
  await page.getByRole('button', { name: 'Listen' }).first().click();
  const [[, langue]] = await page.evaluate(() => (window as any).__lu);
  expect(langue).toBe('en-GB');
});

test('sans synthèse vocale : pas de bouton', async ({ page }) => {
  await page.addInitScript(() => {
    delete (window as any).speechSynthesis;
  });
  await page.goto(url);
  await expect(page.locator('article.carte').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Écouter' })).toHaveCount(0);
});

test("stockage bloqué : la fiche s'affiche", async ({ browser }) => {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('bloqué');
      },
    });
  });
  const page = await ctx.newPage();
  await page.goto(url);
  await expect(page.locator('article.carte').first()).toBeVisible();
  await page.getByRole('button', { name: 'Réglages' }).click();
  await page.getByRole('radio', { name: 'Aéré' }).check();
  await expect(page.locator('html')).toHaveAttribute('data-espacement', 'aere');
  await ctx.close();
});
