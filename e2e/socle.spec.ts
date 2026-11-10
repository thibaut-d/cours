import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('accueil servi sous /cours/', async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  const ff = await page.locator('body').evaluate((e) => getComputedStyle(e).fontFamily);
  expect(ff).toContain('Luciole');
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
});

test('zoom non bloqué', async ({ page }) => {
  await page.goto('/cours/');
  const vp = await page.locator('meta[name=viewport]').getAttribute('content');
  expect(vp).not.toMatch(/maximum-scale|user-scalable/);
});
