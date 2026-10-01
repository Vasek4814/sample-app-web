import { test as base, expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import { InventoryPage } from '../../pageObject/pages/InventoryPage';
import { LoginPage } from '../../pageObject/pages/LoginPage';
import { USERS } from '../../data/users';
import { DrawerMenu } from '../../pageObject/components/DrawerMenu';
import { LazyLoadPage } from '../../pageObject/pages/LazyLoadPage';

type TestFixtures = {
  lazyLoadPage: LazyLoadPage;
  inventoryPage: InventoryPage;
  drawerMenu: DrawerMenu;
  prepareSession: () => Promise<InventoryPage>;
};

const test = base.extend<TestFixtures>({
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  drawerMenu: async ({ page }, use) => use(new DrawerMenu(page)),
  lazyLoadPage: async ({ page }, use) => use(new LazyLoadPage(page)),
  prepareSession: async ({ page, inventoryPage }, use) => {
    await use(async () => {
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await loginPage.login(USERS.valid);
      await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
      return inventoryPage;
    });
  },
});

export { test, expect };
