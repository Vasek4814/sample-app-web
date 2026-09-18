import { test, expect } from '@playwright/test';

import { goToCheckout, VALID_DATA } from './helper/checkout';
import { fillLogin } from './helper/login';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await fillLogin(page);
    await goToCheckout(page);
  });

  test('Оформление заказа с валидными данными проходит успешно', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(VALID_DATA.zip);
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });

  test('Оформление с пустыми полями показывает ошибку', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('');
    await page.getByPlaceholder('Last Name').fill('');
    await page.getByPlaceholder('Zip/Postal Code').fill('');
    await page.locator('#continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('Отмена оформления возвращает в каталог без создания заказа', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(VALID_DATA.zip);
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('На странице Overview сумма позиций равна сумме товаров плюс налог', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(VALID_DATA.zip);
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    const subtotalText = await page.getByTestId('subtotal-label').textContent();
    const subtotal = Number(subtotalText.replace(/[^\d.]/g, ''));
    const taxText = await page.getByTestId('tax-label').textContent();
    const tax = Number(taxText.replace(/[^\d.]/g, ''));
    const totalText = await page.getByTestId('total-label').textContent();
    const total = Number(totalText.replace(/[^\d.]/g, ''));
    const expectedTotal = Math.round((subtotal + tax) * 100) / 100;
    expect(total).toBe(expectedTotal);
  });

  test('Поле Zip принимает только цифры (проверка буквами)', async ({ page }) => {
    test.fail();

    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill('fsadsa');
    await page.locator('#continue').click();

    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });

  test('После завершения заказа корзина пуста, кнопки снова Add to cart', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(VALID_DATA.zip);
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);

    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');

    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);

    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0);
  });
});

test.describe('Оформление заказа с пустой корзиной', () => {
  test.beforeEach(async ({ page }) => {
    await fillLogin(page);
  });

  test('Оформление с пустой корзиной невозможно', async ({ page }) => {
    test.fail();
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/.*cart\.html/);

    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByPlaceholder('First Name').fill(VALID_DATA.firstName);
    await page.getByPlaceholder('Last Name').fill(VALID_DATA.lastName);
    await page.getByPlaceholder('Zip/Postal Code').fill(VALID_DATA.zip);
    await page.locator('#continue').click();

    await expect(page.getByTestId('error')).toBeVisible();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);
  });
});
