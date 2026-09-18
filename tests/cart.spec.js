import { test, expect } from '@playwright/test';
import { fillLogin } from './helper/login';

test.describe('Корзина', () => {
  test.beforeEach(async ({ page }) => {
    await fillLogin(page);
  });
  test('Добавление одного товара: бейдж корзины равен 1', async ({ page }) => {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  test('Добавление трёх товаров: бейдж корзины равен 3', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
  });

  test('Удаление одного товара из каталога: бейдж уменьшается с 3 до 2', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');

    await page.getByRole('button', { name: 'Remove' }).first().click();

    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
  });

  test('Товары в корзине: названия и цены совпадают с каталогом', async ({ page }) => {
    const names = page.getByTestId('inventory-item-name');
    const prices = page.getByTestId('inventory-item-price');

    const expectedNames = [
      await names.nth(0).textContent(),
      await names.nth(1).textContent(),
      await names.nth(2).textContent(),
    ];
    const expectedPrices = [
      await prices.nth(0).textContent(),
      await prices.nth(1).textContent(),
      await prices.nth(2).textContent(),
    ];

    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    await page.getByTestId('shopping-cart-link').click();

    const cartNames = await page.getByTestId('inventory-item-name').allTextContents();
    const cartPrices = await page.getByTestId('inventory-item-price').allTextContents();

    expect(cartNames).toEqual(expectedNames);
    expect(cartPrices).toEqual(expectedPrices);
  });

  test('Корзина сохраняется после перезагрузки страницы', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    await page.getByTestId('shopping-cart-link').click();
    await expect(page.getByTestId('inventory-item')).toHaveCount(3);

    await page.reload();

    await expect(page.getByTestId('inventory-item')).toHaveCount(3);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
  });

  test('Кнопка Continue Shopping: возврат в каталог, корзина сохраняется', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
  });

  test('Удаление всех товаров из корзины: бейдж скрыт', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Add to cart' }).first().click();
    }

    await page.getByTestId('shopping-cart-link').click();

    // Кликаем Remove, пока кнопки не кончатся
    const removeButtons = page.getByRole('button', { name: 'Remove' });
    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
    }

    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
  });
});
