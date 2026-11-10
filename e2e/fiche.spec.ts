import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const url = '/cours/6e/histoire/essai-publie/';

test('cartes, compteur, image générée', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('article.carte').first().locator('.compteur')).toHaveText(/^1 \/ \d+$/);
  await expect(page.getByText('Image générée').first()).toBeVisible();
  await expect(page.getByText('anthropologiquement')).toBeVisible();
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
});

for (const largeur of [320, 375, 390, 768, 1280])
  test(`pas de défilement horizontal à ${largeur}px`, async ({ page }) => {
    await page.setViewportSize({ width: largeur, height: 800 });
    await page.goto(url);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

test('typographie de lecture', async ({ page }) => {
  await page.goto(url);
  const p = page.locator('article.carte p.phrase').first();
  expect(parseFloat(await p.evaluate((e) => getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(20);
  expect(await p.evaluate((e) => getComputedStyle(e).textAlign)).not.toBe('justify');
  expect(await page.locator('main *').evaluateAll((es) => es.some((e) => getComputedStyle(e).fontStyle === 'italic'))).toBe(false);
  expect(await page.locator('.mot-cle').first().evaluate((e) => getComputedStyle(e).textTransform)).toBe('none');
});

test("notes de l'orateur jamais affichées", async ({ page }) => {
  await page.goto(url);
  await expect(page.getByText('NOTE-ORATEUR-ESSAI')).toHaveCount(0); // présente dans le YAML d'essai
});

test('frise et questions', async ({ page }) => {
  await page.goto(url);
  await expect(page.locator('.frise li')).toHaveCount(3);
  const reponse = page.locator('.questions .reponse').first();
  await expect(reponse).toBeVisible();
  await page.getByRole('button', { name: 'Cacher les réponses' }).click();
  await expect(reponse).toBeHidden();
  await page.getByRole('button', { name: 'Voir la réponse' }).first().click();
  await expect(reponse).toBeVisible();
});

test('leçon en anglais', async ({ page }) => {
  await page.goto('/cours/sup/data-sciences/essai-anglais/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
