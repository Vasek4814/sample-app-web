import { test as base, expect } from "@playwright/test";
import { URL_PATTERN } from "../../constants/routes";
import { Header } from "../../pageObject/components/Header";
import { CartPage } from "../../pageObject/pages/CartPage";
import { InventoryPage } from "../../pageObject/pages/InventoryPage";
import { LoginPage } from "../../pageObject/pages/LoginPage";
import { USERS } from "../../data/users";

type TestFixtures = {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  header: Header;
  prepareSession: () => Promise<InventoryPage>;
  prepareCart: (count?: number) => Promise<InventoryPage>;
};

const test = base.extend<TestFixtures>({
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
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
    await use(async (count: number = 3) => {
      const inventoryPage = await prepareSession();
      await inventoryPage.addToCart(count);
      return inventoryPage;
    });
  },
});

export default test;
