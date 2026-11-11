import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accueil servi sous /cours/', async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  const ff = await page.locator('body').evaluate((e) => getComputedStyle(e).fontFamily);
  expect(ff).toContain('Luciole');
  // Le fichier de police est réellement chargé (et non le repli système).
  const chargee = await page.evaluate(async () => {
    await document.fonts.load('16px Luciole');
    await document.fonts.ready;
    return document.fonts.check('16px Luciole');
  });
  expect(chargee).toBe(true);
  const luciole = await page.evaluate(() => [...document.fonts].filter((f) => f.family.includes('Luciole') && f.status === 'loaded').length);
  expect(luciole).toBeGreaterThan(0);
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
});

test('zoom non bloqué', async ({ page }) => {
  await page.goto('/cours/');
  const vp = await page.locator('meta[name=viewport]').getAttribute('content');
  expect(vp).not.toMatch(/maximum-scale|user-scalable/);
});

test("icônes du site : chaque fichier déclaré dans la page existe", async ({ page, request }) => {
  await page.goto('/cours/');
  const liens = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]').evaluateAll((ls) => ls.map((l) => (l as HTMLLinkElement).href));
  expect(liens).toHaveLength(4);
  for (const href of liens) expect((await request.get(href)).status(), href).toBe(200);
});
