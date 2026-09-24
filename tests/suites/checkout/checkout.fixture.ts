import { test as base, expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import { USERS } from '../../data/users';
import { Header } from '../../pageObject/components/Header';
import { CartPage } from '../../pageObject/pages/CartPage';
import { CheckoutPage } from '../../pageObject/pages/CheckoutPage';
import { InventoryPage } from '../../pageObject/pages/InventoryPage';
import { LoginPage } from '../../pageObject/pages/LoginPage';

type TestFixtures = {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  header: Header;
  prepareSession: () => Promise<InventoryPage>;
  prepareCart: () => Promise<InventoryPage>;
  prepareCheckout: () => Promise<CheckoutPage>;
};

const test = base.extend<TestFixtures>({
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  header: async ({ page }, use) => use(new Header(page)),
  prepareSession: async ({ page, inventoryPage }, use) => {
    await use(async () => {
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await loginPage.login(USERS.valid);
      await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
      return inventoryPage;
    });
  },
  prepareCart: async ({ prepareSession }, use) => {
    await use(async () => {
      const inventoryPage = await prepareSession();
      await inventoryPage.addToCart(3);
      return inventoryPage;
    });
  },
  prepareCheckout: async ({ page, prepareCart, header, cartPage, checkoutPage }, use) => {
    await use(async () => {
      await prepareCart();
      await header.openCart();
      await expect(page).toHaveURL(URL_PATTERN.CART);
      await cartPage.checkoutButton.click();
      await expect(page).toHaveURL(URL_PATTERN.CHECKOUT_STEP_ONE);
      return checkoutPage;
    });
  },
});

export default test;
