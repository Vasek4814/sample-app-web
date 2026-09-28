import { test as base } from '@playwright/test';
import { LoginPage } from '../../pageObject/pages/LoginPage';
import { DrawerMenu } from '../../pageObject/components/DrawerMenu';

type TestFixtures = {
  loginPage: LoginPage;
  DrawerMenu: DrawerMenu;
};

const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  DrawerMenu: async ({ page }, use) => use(new DrawerMenu(page)),
});

export default test;
