import { expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import test from './cart.fixture';

test.describe('Корзина', () => {
  test.beforeEach(async ({ prepareSession }) => {
    await prepareSession();
  });
  test('Добавление одного товара: бейдж корзины равен 1', async ({ inventoryPage, header }) => {
    await inventoryPage.addToCart(1);
    await expect(header.cartBadge).toHaveText('1');
  });
  test('Добавление трёх товаров: бейдж корзины равен 3', async ({ inventoryPage, header }) => {
    await inventoryPage.addToCart(3);
    await expect(header.cartBadge).toHaveText('3');
  });
  test('Удаление одного товара из каталога: бейдж уменьшается с 3 до 2', async ({
    inventoryPage,
    header,
  }) => {
    await inventoryPage.addToCart(3);
    await expect(header.cartBadge).toHaveText('3');
    await inventoryPage.removeButtons.first().click();
    await expect(header.cartBadge).toHaveText('2');
  });
  test('Товары в корзине: названия и цены совпадают с каталогом', async ({
    page,
    inventoryPage,
    header,
    cartPage,
  }) => {
    await expect(inventoryPage.itemNames).toHaveCount(6);
    await expect(inventoryPage.itemPrices).toHaveCount(6);
    const expectedNames = [
      await inventoryPage.itemNames.nth(0).textContent(),
      await inventoryPage.itemNames.nth(1).textContent(),
      await inventoryPage.itemNames.nth(2).textContent(),
    ];
    const expectedPrices = [
      await inventoryPage.itemPrices.nth(0).textContent(),
      await inventoryPage.itemPrices.nth(1).textContent(),
      await inventoryPage.itemPrices.nth(2).textContent(),
    ];
    await inventoryPage.addToCart(3);
    await expect(header.cartBadge).toHaveText('3');
    await header.openCart();
    await expect(page).toHaveURL(URL_PATTERN.CART);
    await expect(cartPage.items).toHaveCount(3);
    const cartNames = await cartPage.itemNames.allTextContents();
    const cartPrices = await cartPage.itemPrices.allTextContents();
    expect(cartNames).toEqual(expectedNames);
    expect(cartPrices).toEqual(expectedPrices);
  });
  test('Корзина сохраняется после перезагрузки страниц', async ({
    page,
    inventoryPage,
    header,
    cartPage,
  }) => {
    await inventoryPage.addToCart(3);
    await header.openCart();
    await expect(cartPage.items).toHaveCount(3);
    await page.reload();
    await expect(cartPage.items).toHaveCount(3);
    await expect(header.cartBadge).toHaveText('3');
  });
  test('Кнопка Continue Shopping: возврат в каталог, корзина сохраняется', async ({
    inventoryPage,
    header,
    cartPage,
  }) => {
    await inventoryPage.addToCart(3);
    await header.openCart();
    await cartPage.continueShoppingButton.click();
    await expect(inventoryPage.page).toHaveURL(URL_PATTERN.INVENTORY);
    await expect(header.cartBadge).toHaveText('3');
  });
  test('Удаление всех товаров из корзины: бейдж скрыт', async ({
    inventoryPage,
    header,
    cartPage,
  }) => {
    await inventoryPage.addToCart(3);
    await header.openCart();
    await cartPage.removeAllItems();
    await expect(header.cartBadge).toBeHidden();
  });
});
