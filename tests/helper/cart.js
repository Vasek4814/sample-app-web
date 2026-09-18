import { expect } from '@playwright/test';

export async function addItemsToCart(page) {
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
  }
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('3');
}
