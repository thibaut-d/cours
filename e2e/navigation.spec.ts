import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function axeSansViolation(page: Page) {
  expect(await new AxeBuilder({ page }).analyze().then((r) => r.violations)).toEqual([]);
}

const HISTOIRE_6E = "Leçon d'essai publiée";
const SVT_COLLEGE = "Leçon d'essai de SVT pour tout le collège";
const IA_PROFESSEURS = "Leçon d'essai d'intelligence artificielle pour les professeurs";
const SUPERIEUR = 'Sample lesson in English';
const PUBLIEES = [HISTOIRE_6E, SVT_COLLEGE, IA_PROFESSEURS, SUPERIEUR];

const tuile = (page: Page, titre: string) => page.getByRole('link', { name: new RegExp(`^${titre}`) });
const boutonPublic = (page: Page, nom: string) => page.getByRole('group', { name: 'Public' }).getByRole('button', { name: nom, exact: true });
const boutonMatiere = (page: Page, nom: string) => page.getByRole('group', { name: 'Matière' }).getByRole('button', { name: nom, exact: true });
const toutVoir = (page: Page) => page.getByRole('button', { name: 'Tout voir' });

async function seulesVisibles(page: Page, visibles: string[]) {
  for (const titre of PUBLIEES) {
    if (visibles.includes(titre)) await expect(tuile(page, titre)).toBeVisible();
    else await expect(tuile(page, titre)).toBeHidden();
  }
}

test("accueil : toutes les leçons publiées, aucun brouillon", async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Cours');
  await seulesVisibles(page, PUBLIEES);
  await expect(page.getByText("Leçon d'essai en brouillon")).toHaveCount(0);
  await expect(page.getByText('Seule leçon de 5e')).toHaveCount(0);
  await axeSansViolation(page);
});

test('boutons publics : seulement ceux qui montrent une leçon, dans l’ordre scolaire', async ({ page }) => {
  await page.goto('/cours/');
  await expect(page.getByRole('group', { name: 'Public' })).toBeVisible();
  const noms = await page.getByRole('group', { name: 'Public' }).getByRole('button').allInnerTexts();
  expect(noms.map((n) => n.trim())).toEqual(['Collège', '6e', '5e', '4e', '3e', 'Supérieur', 'Professeurs']);
  const matieres = await page.getByRole('group', { name: 'Matière' }).getByRole('button').allInnerTexts();
  expect(matieres.map((n) => n.trim())).toEqual(['Data sciences', 'Histoire', 'Intelligence artificielle', 'SVT']);
});

test('filtrer par public puis par matière, mémoire, puis « Tout voir »', async ({ page }) => {
  await page.goto('/cours/');
  await boutonPublic(page, '6e').click();
  await expect(boutonPublic(page, '6e')).toHaveAttribute('aria-pressed', 'true');
  await expect(boutonPublic(page, '5e')).toHaveAttribute('aria-pressed', 'false');
  await expect(page).toHaveURL(/\/cours\/\?public=6e$/);
  await seulesVisibles(page, [HISTOIRE_6E, SVT_COLLEGE]);
  await axeSansViolation(page);

  await boutonMatiere(page, 'Histoire').click();
  await expect(page).toHaveURL(/\/cours\/\?public=6e&matiere=histoire$/);
  await seulesVisibles(page, [HISTOIRE_6E]);
  await expect(page.getByRole('heading', { name: 'SVT' })).toBeHidden();

  await page.goto('/cours/');
  await expect(page).toHaveURL(/\/cours\/\?public=6e&matiere=histoire$/);
  await expect(boutonPublic(page, '6e')).toHaveAttribute('aria-pressed', 'true');
  await expect(boutonMatiere(page, 'Histoire')).toHaveAttribute('aria-pressed', 'true');
  await seulesVisibles(page, [HISTOIRE_6E]);

  await toutVoir(page).click();
  await expect(page).toHaveURL(/\/cours\/$/);
  await expect(boutonPublic(page, '6e')).toHaveAttribute('aria-pressed', 'false');
  await seulesVisibles(page, PUBLIEES);
  await page.goto('/cours/');
  await expect(page).toHaveURL(/\/cours\/$/);
  await seulesVisibles(page, PUBLIEES);
});

test('valeurs inconnues dans l’adresse : ignorées, tout est visible', async ({ page }) => {
  await page.goto('/cours/?public=xyz&matiere=inconnue');
  await seulesVisibles(page, PUBLIEES);
  await expect(page).toHaveURL(/\/cours\/$/);
});

test('combinaison vide : message et « Tout voir »', async ({ page }) => {
  await page.goto('/cours/?public=professeurs&matiere=svt');
  await seulesVisibles(page, []);
  await expect(page.getByRole('status')).toHaveText('Aucune leçon ne correspond à ces filtres.');
  await expect(toutVoir(page)).toBeVisible();
  await axeSansViolation(page);
  await toutVoir(page).click();
  await seulesVisibles(page, PUBLIEES);
  await expect(page.getByText('Aucune leçon ne correspond à ces filtres.')).toBeHidden();
});

test('stockage bloqué : les filtres marchent sans mémoire', async ({ browser }) => {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('bloqué');
      },
    });
  });
  const page = await ctx.newPage();
  const erreurs: Error[] = [];
  page.on('pageerror', (e) => erreurs.push(e));
  await page.goto('/cours/');
  await boutonPublic(page, '6e').click();
  await expect(boutonPublic(page, '6e')).toHaveAttribute('aria-pressed', 'true');
  await seulesVisibles(page, [HISTOIRE_6E, SVT_COLLEGE]);
  expect(erreurs).toEqual([]);
  await ctx.close();
});

test('sans JavaScript : toutes les leçons, filtres masqués', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/cours/');
  await seulesVisibles(page, PUBLIEES);
  await expect(page.getByRole('button', { name: '6e', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Tout voir' })).toHaveCount(0);
  await ctx.close();
});

test("fil d'Ariane d'une leçon : « Cours » et la matière filtrée", async ({ page }) => {
  await page.goto('/cours/6e/histoire/essai-publie/');
  const fil = page.getByRole('navigation', { name: "Fil d'Ariane" });
  await expect(fil.getByRole('link', { name: 'Cours' })).toHaveAttribute('href', '/cours/');
  await expect(fil.getByRole('link', { name: 'Histoire' })).toHaveAttribute('href', '/cours/?matiere=histoire');
  await expect(fil.getByRole('link')).toHaveCount(2);
  await fil.getByRole('link', { name: 'Histoire' }).click();
  await expect(boutonMatiere(page, 'Histoire')).toHaveAttribute('aria-pressed', 'true');
  await seulesVisibles(page, [HISTOIRE_6E]);
});

test('une tuile mène à sa leçon', async ({ page }) => {
  await page.goto('/cours/');
  await tuile(page, SVT_COLLEGE).click();
  await expect(page).toHaveURL(/\/cours\/college\/svt\/essai-svt-college\/$/);
  await expect(page.locator('h1')).toHaveText(SVT_COLLEGE);
});

test('pages intermédiaires et brouillons absents du site construit', async ({ request }) => {
  expect((await request.get('/cours/6e/')).status()).toBe(404);
  expect((await request.get('/cours/6e/histoire/')).status()).toBe(404);
  expect((await request.get('/cours/6e/histoire/essai-brouillon/')).status()).toBe(404);
  expect((await request.get('/cours/5e/')).status()).toBe(404);
});

test('cibles tactiles >= 48 px : filtres et tuiles', async ({ page }) => {
  await page.goto('/cours/');
  const cibles = [
    ...(await page.locator('.filtres button').all()),
    ...(await page.locator('.tuile-lecon').all()),
  ];
  expect(cibles.length).toBeGreaterThan(10);
  for (const cible of cibles) {
    const box = (await cible.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(48);
    expect(box.width).toBeGreaterThanOrEqual(48);
  }
});

for (const largeur of [320, 375, 390, 768, 1280])
  test(`accueil : pas de défilement horizontal à ${largeur}px`, async ({ page }) => {
    await page.setViewportSize({ width: largeur, height: 800 });
    await page.goto('/cours/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

for (const largeur of [320, 390])
  test(`accueil : pas de défilement horizontal à ${largeur}px, réglages maximaux`, async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem('cours-reglages', JSON.stringify({ taille: 'tres-grande', espacement: 'aere', fond: 'creme', vitesse: 1 })),
    );
    await page.setViewportSize({ width: largeur, height: 800 });
    await page.goto('/cours/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto('/cours/?public=professeurs&matiere=svt');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
