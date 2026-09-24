import { URL_PATTERN } from '../../constants/routes';
import { USERS } from '../../data/users';
import { InventoryPage } from '../../pageObject/pages/InventoryPage';
import { test, expect } from './productCatalog.fixture';

test.describe('Каталог товаров', () => {
  test.beforeEach(async ({ prepareSession }) => {
    await prepareSession(USERS.valid);
  });
  test('Отображает ровно 6 товаров с ценами и картинками', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    await expect(inventoryPage.itemImages).toHaveCount(6);
    await expect(inventoryPage.itemPrices).toHaveCount(6);
  });
  test('Сортировка A-Z и Z-A по названию даёт корректный порядок', async ({ inventoryPage }) => {
    await inventoryPage.sort('az');
    const asc = await inventoryPage.itemNames.allTextContents();
    await inventoryPage.sort('za');
    const desc = await inventoryPage.itemNames.allTextContents();
    expect(desc).toEqual([...asc].reverse());
  });
  test('Сортировка Price low-high и high-low даёт корректный порядок', async ({
    inventoryPage,
  }) => {
    await inventoryPage.sort('lohi');
    const lowToHigh = await inventoryPage.itemPrices.allTextContents();

    await inventoryPage.sort('hilo');
    const highToLow = await inventoryPage.itemPrices.allTextContents();

    const toNumber = (price: string) => Number(price.replace('$', ''));

    expect(lowToHigh.map(toNumber)).toEqual([...lowToHigh.map(toNumber)].sort((a, b) => a - b));
    expect(highToLow.map(toNumber)).toEqual([...highToLow.map(toNumber)].sort((a, b) => b - a));
  });
  test('Каждый из 6 товаров открывается по клику на название', async ({ page, inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);

    const count = await inventoryPage.items.count();

    for (let i = 0; i < count; i++) {
      const item = inventoryPage.itemByIndex(i);
      const name = await item.getByTestId('inventory-item-name').textContent();

      await item.getByTestId('inventory-item-name').click();

      const detailsName = page.locator('.inventory_details_name');
      await expect(detailsName).toBeVisible();
      await expect(detailsName).toHaveText(name!);

      await page.goBack();
      await expect(inventoryPage.items).toHaveCount(6);
    }
  });
  test('Каждый из 6 товаров открывается по клику на картинку', async ({ page, inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);

    const count = await inventoryPage.items.count();

    for (let i = 0; i < count; i++) {
      const item = inventoryPage.itemByIndex(i);
      const name = await item.getByTestId('inventory-item-name').textContent();

      await item.getByTestId(/-img$/).click();

      const detailsName = page.locator('.inventory_details_name');
      await expect(detailsName).toBeVisible();
      await expect(detailsName).toHaveText(name!);

      await page.goBack();
      await expect(inventoryPage.items).toHaveCount(6);
    }
  });
});
test.describe('Особые пользователи', () => {
  test('problem_user: картинки товаров не соответствуют названиям', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.login(USERS.problem);
    await expect(inventoryPage.items).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const item = inventoryPage.itemByIndex(i);
      const name = (await item.getByTestId('inventory-item-name').textContent())?.trim();
      const alt = await item.getByTestId(/-img$/).getAttribute('alt');
      expect(alt?.trim()).toBe(name);
    }
  });
  test('performance_glitch_user: каталог грузится медленно, но не ломается', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.fillLoginForm(USERS.performanceGlitch);

    const start = Date.now();
    await loginPage.loginButton.click();

    const items = inventoryPage.items;
    await expect(items).toHaveCount(6, { timeout: 30_000 });

    const duration = Date.now() - start;

    await expect(items).toHaveCount(6);
    await expect(page).toHaveURL(URL_PATTERN.INVENTORY);

    expect(duration).toBeGreaterThan(3_000);
  });
});
