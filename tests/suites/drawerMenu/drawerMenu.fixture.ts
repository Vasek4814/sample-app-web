import { test as base, expect } from '@playwright/test';
import { URL_PATTERN } from '../../constants/routes';
import { Header } from '../../pageObject/components/Header';
import { CartPage } from '../../pageObject/pages/CartPage';
import { InventoryPage } from '../../pageObject/pages/InventoryPage';
import { LoginPage } from '../../pageObject/pages/LoginPage';
import { USERS } from '../../data/users';
import { DrawerMenu } from '../../pageObject/components/DrawerMenu';
import { LazyLoadPage } from '../../pageObject/pages/LazyLoadPage';
import { SliderPage } from '../../pageObject/pages/sliderPage';

type TestFixtures = {
  cartPage: CartPage;
  inventoryPage: InventoryPage;
  loginPage: LoginPage;
  lazyLoadPage: LazyLoadPage;
  sliderPage: SliderPage;
  drawerMenu: DrawerMenu;
  header: Header;
  prepareSession: () => Promise<InventoryPage>;
  prepareCart: (count?: number) => Promise<InventoryPage>;
};

const test = base.extend<TestFixtures>({
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  header: async ({ page }, use) => use(new Header(page)),
  drawerMenu: async ({ page }, use) => use(new DrawerMenu(page)),
  lazyLoadPage: async ({ page }, use) => use(new LazyLoadPage(page)),
  sliderPage: async ({ page }, use) => use(new SliderPage(page)),
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

export { test, expect };
