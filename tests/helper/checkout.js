import { expect } from '@playwright/test';

export const VALID_DATA = {
  firstName: 'Vasiliy',
  lastName: 'Naberezhniy',
  zip: '142190',
};

export async function prepareCheckoutWithThreeItems(page) {
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
  }
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/.*cart\.html/);
  await page.getByRole('button', { name: 'Checkout' }).click();
}

export async function fillCheckoutForm(page, data) {
  await page.getByPlaceholder('First Name').fill(data.firstName);
  await page.getByPlaceholder('Last Name').fill(data.lastName);
  await page.getByPlaceholder('Zip/Postal Code').fill(data.zip);
}

export async function submitCheckoutForm(page) {
  await page.locator('#continue').click();
  await expect(page).toHaveURL(/.*checkout-step-two\.html/);
}
