import { expect } from '@playwright/test';
import { addThreeItemsToCart } from './cart';

export const VALID_DATA = {
  firstName: 'Vasiliy',
  lastName: 'Naberezhniy',
  zip: '142190',
};

export async function prepareCheckoutWithThreeItems(page) {
  await addThreeItemsToCart(page);
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/.*cart\.html/);
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/.*checkout-step-one\.html/);
}
