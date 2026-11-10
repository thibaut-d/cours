import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function axeSansViolation(page: import('@playwright/test').Page) {
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
}

test('accueil : seuls les niveaux publiés', async ({ page }) => {
  await page.goto('/cours/?choisir');
  await expect(page.getByRole('link', { name: '6e' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Supérieur' })).toBeVisible();
  await expect(page.getByRole('link', { name: '5e' })).toHaveCount(0); // seulement un brouillon
  await expect(page.locator('h1')).toHaveCount(1);
  await axeSansViolation(page);
});

test('niveau → matière → leçon', async ({ page }) => {
  await page.goto('/cours/?choisir');
  await page.getByRole('link', { name: '6e' }).click();
  await expect(page).toHaveURL(/\/cours\/6e\/$/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Changer de niveau' })).toHaveAttribute('href', '/cours/?choisir');
  await axeSansViolation(page);
  await page.getByRole('link', { name: 'Histoire' }).click();
  await expect(page).toHaveURL(/\/cours\/6e\/histoire\/$/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: "Fil d'Ariane" })).toBeVisible();
  await expect(page.getByRole('link', { name: "Leçon d'essai publiée" })).toBeVisible();
  await expect(page.getByRole('link', { name: /essai-brouillon|Essai brouillon|brouillon/i })).toHaveCount(0);
  await axeSansViolation(page);
});

test('cibles tactiles >= 48 px', async ({ page }) => {
  await page.goto('/cours/?choisir');
  for (const nom of ['6e', 'Supérieur']) {
    const box = await page.getByRole('link', { name: nom }).boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(48);
  }
});

test('brouillon absent du site construit', async ({ request }) => {
  expect((await request.get('/cours/6e/histoire/essai-brouillon/')).status()).toBe(404);
  expect((await request.get('/cours/5e/')).status()).toBe(404);
});

test('retour direct au dernier niveau', async ({ page }) => {
  await page.goto('/cours/6e/');
  await page.goto('/cours/');
  await expect(page).toHaveURL(/\/cours\/6e\/$/);
  await page.goto('/cours/?choisir');
  await expect(page).toHaveURL(/\?choisir$/);
});

test("stockage bloqué : l'accueil reste utilisable", async ({ browser }) => {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('bloqué');
      },
    });
  });
  const page = await ctx.newPage();
  await page.goto('/cours/');
  await expect(page.getByRole('link', { name: '6e' })).toBeVisible();
  await ctx.close();
});

test("fil d'Ariane : « Cours » ramène au choix du niveau", async ({ page }) => {
  await page.goto('/cours/6e/');
  await page.getByRole('navigation', { name: "Fil d'Ariane" }).getByRole('link', { name: 'Cours' }).click();
  await expect(page).toHaveURL(/\/cours\/\?choisir$/);
  await expect(page.getByRole('link', { name: '6e' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Supérieur' })).toBeVisible();
});
