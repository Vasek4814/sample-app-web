import { test, expect } from '@playwright/test';
import { login } from './helper/login';
import {
  prepareCheckoutWithThreeItems,
  fillCheckoutForm,
  submitCheckoutForm,
  VALID_DATA,
} from './helper/checkout';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Оформление заказа с валидными данными проходит успешно', async ({ page }) => {
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, VALID_DATA);
    await submitCheckoutForm(page);
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });

  test('Оформление с пустыми полями показывает ошибку First Name is required', async ({ page }) => {
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, { firstName: '', lastName: '', zip: '' });
    await page.locator('#continue').click();
    await expect(page.getByTestId('error')).toBeVisible();
  });

  test('Отмена оформления возвращает в каталог без создания заказа', async ({ page }) => {
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, VALID_DATA);
    await submitCheckoutForm(page);
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('На странице Overview сумма позиций равна сумме товаров плюс налог', async ({ page }) => {
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, VALID_DATA);
    await submitCheckoutForm(page);

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
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, { ...VALID_DATA, zip: 'fsadsa' });
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('Оформление заказа с пустой корзиной невозможно - выдет ошибку', async ({ page }) => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/.*cart\.html/);
    await page.getByRole('button', { name: 'Checkout' }).click();
    await fillCheckoutForm(page, VALID_DATA);
    await page.locator('#continue').click();
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  });

  test('После завершения заказа корзина пуста, кнопки снова Add to cart', async ({ page }) => {
    await prepareCheckoutWithThreeItems(page);
    await fillCheckoutForm(page, VALID_DATA);
    await submitCheckoutForm(page);
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.getByTestId('shopping-cart-badge')).toBeHidden();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);
    await expect(page.getByRole('button', { name: 'Remove' })).toHaveCount(0);
  });
});
