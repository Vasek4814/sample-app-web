import { expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import { checkoutData } from '../../data/checkoutData';
import test from './checkout.fixture';
import { before, beforeEach } from 'node:test';
import { CheckoutPage } from '../../pageObject/pages/CheckoutPage';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ prepareCheckout }) => {
    await prepareCheckout();
  });
  test('Оформление заказа с валидными данными проходит успешно', async ({ page, checkoutPage }) => {
    await checkoutPage.fillForm(checkoutData.output());
    await checkoutPage.continue();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_TW0);

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
  test('Оформление с пустыми полями показывает ошибку', async ({ page, checkoutPage }) => {
    await checkoutPage.fillForm(checkoutData.output({ firstName: '', lastName: '', zip: '' }));
    await checkoutPage.continue();
    await expect(checkoutPage.error).toBeVisible();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_ONE);
  });
  test('Отмена оформления возвращает в каталог без создания заказа', async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.fillForm(checkoutData.output());
    await checkoutPage.continue();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_TW0);
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
  });
  test('На странице Overview сумма позиций равна сумме товаров плюс налог', async ({
    page,
    checkoutPage,
  }) => {
    await checkoutPage.fillForm(checkoutData.output());
    await checkoutPage.continue();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_TW0);
    const { subtotal, tax, total } = await checkoutPage.readAmounts();
    const expectedTotal = Math.round((subtotal + tax) * 100) / 100;
    expect(total).toBe(expectedTotal);
  });
  test('Поле Zip принимает только цифры (проверка буквами)', async ({ page, checkoutPage }) => {
    test.fail();
    await checkoutPage.fillForm(checkoutData.output({ zip: 'fsadsa' }));
    await checkoutPage.continue();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_ONE);
  });
  test('После завершения заказа корзина пуста, кнопки снова Add to car', async ({
    page,
    checkoutPage,
    inventoryPage,
    header,
  }) => {
    await checkoutPage.fillForm(checkoutData.output());
    await checkoutPage.continue();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_TW0);
    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await checkoutPage.backHomeButton.click();
    await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
    await expect(header.cartBadge).toBeHidden();
    await expect(inventoryPage.addToCartButtons).toHaveCount(6);
    await expect(inventoryPage.removeButtons).toHaveCount(0);
  });
});

test.describe('Оформление заказа с пустой корзиной', () => {
  test('Оформление с пустой корзиной невозможно', async ({
    page,
    prepareSession,
    header,
    cartPage,
    checkoutPage,
  }) => {
    test.fail();
    await prepareSession();
    await header.openCart();
    await expect(page).toHaveURL(URL_PATTERN.CART);
    await cartPage.checkoutButton.click();
    await checkoutPage.fillForm(checkoutData.output());
    await checkoutPage.continue();
    await expect(checkoutPage.error).toBeVisible();
    await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_ONE);
  });
});
