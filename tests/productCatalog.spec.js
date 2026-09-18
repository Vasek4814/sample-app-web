import { test, expect } from '@playwright/test';
import { fillLogin } from './helper/login';

test.describe('Каталог товаров', () => {
  test.beforeEach(async ({ page }) => {
    await fillLogin(page);
  });
  test('отображает ровно 6 товаров с ценами и картинками', async ({ page }) => {
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
    await expect(page.locator('img.inventory_item_img')).toHaveCount(6);
    await expect(page.getByTestId('inventory-item-price')).toHaveCount(6);
  });

  test('сортировка A-Z и Z-A по названию даёт корректный порядок', async ({ page }) => {
    await page.locator('select.product_sort_container').selectOption('az');
    const asc = await page.locator('div.inventory_item_name').allTextContents();

    await page.locator('select.product_sort_container').selectOption('za');
    const desc = await page.locator('div.inventory_item_name').allTextContents();

    expect(desc).toEqual([...asc].reverse());
  });

  test('сортировка Price low-high и high-low даёт корректный порядок', async ({ page }) => {
    await page.locator('select.product_sort_container').selectOption('lohi');
    const lowToHigh = await page.getByTestId('inventory-item-price').allTextContents();

    await page.locator('select.product_sort_container').selectOption('hilo');
    const highToLow = await page.getByTestId('inventory-item-price').allTextContents();

    const toNumber = (price) => Number(price.replace('$', ''));

    expect(lowToHigh.map(toNumber)).toEqual([...lowToHigh.map(toNumber)].sort((a, b) => a - b));
    expect(highToLow.map(toNumber)).toEqual([...highToLow.map(toNumber)].sort((a, b) => b - a));
  });

  test('каждый из 6 товаров открывается по клику на название', async ({ page }) => {
    const items = page.getByTestId('inventory-item');
    await expect(items).toHaveCount(6);

    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = page.getByTestId('inventory-item').nth(i);
      const name = await item.getByTestId('inventory-item-name').textContent();

      await item.getByTestId('inventory-item-name').click();

      await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
      const details = page.locator('.inventory_details_container');
      await expect(details.getByTestId('inventory-item-name')).toHaveText(name);

      await page.goBack();
      await expect(items).toHaveCount(6);
    }
  });

  test('каждый из 6 товаров открывается по клику на картинку', async ({ page }) => {
    const items = page.getByTestId('inventory-item');
    await expect(items).toHaveCount(6);

    const count = await items.count();

    for (let i = 0; i < count; i++) {
      const item = page.getByTestId('inventory-item').nth(i);
      const name = await item.getByTestId('inventory-item-name').textContent();

      await item.locator('img.inventory_item_img').click();

      await expect(page).toHaveURL(/inventory-item\.html\?id=\d+/);
      const details = page.locator('.inventory_details_container');
      await expect(details.getByTestId('inventory-item-name')).toHaveText(name);

      await page.goBack();
      await expect(items).toHaveCount(6);
    }
  });
});

test('problem_user: картинки товаров не соответствуют названиям', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#user-name').fill('problem_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const items = page.getByTestId('inventory-item');
  await expect(items).toHaveCount(6);

  for (let i = 0; i < 6; i++) {
    const item = items.nth(i);
    const name = (await item.getByTestId('inventory-item-name').textContent())?.trim();
    const alt = await item.locator('img.inventory_item_img').getAttribute('alt');

    expect(alt?.trim()).toBe(name);
  }
});

const PERFORMANCE_THRESHOLD_MS = 3000;

test('performance_glitch_user: каталог грузится медленно, но не ломается', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('#user-name').fill('performance_glitch_user');
  await page.locator('#password').fill('secret_sauce');

  const start = Date.now();
  await page.locator('#login-button').click();

  const items = page.getByTestId('inventory-item');
  await expect(items).toHaveCount(6, { timeout: 30_000 });

  const duration = Date.now() - start;
  console.log(`⏱ Загрузка каталога у performance_glitch_user: ${duration} мс`);

  // Каталог не сломался
  await expect(items).toHaveCount(6);
  await expect(page).toHaveURL(/.*inventory.html/);

  // Загрузка заняла больше порога — это ожидаемое поведение
  expect(duration).toBeGreaterThan(PERFORMANCE_THRESHOLD_MS);
});
