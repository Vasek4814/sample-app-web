import { test as base, expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import type { TestUser } from '../../data/users';
import { USERS } from '../../data/users';
import { InventoryPage } from '../../pageObject/pages/InventoryPage';
import { LoginPage } from '../../pageObject/pages/LoginPage';

type TestFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  prepareSession: (user?: TestUser) => Promise<InventoryPage>;
};

const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  prepareSession: async ({ page, loginPage, inventoryPage }, use) => {
    await use(async (user: TestUser = USERS.valid) => {
      await loginPage.open();
      await loginPage.login(user);
      await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
      return inventoryPage;
    });
  },
});

export { test, expect };
