import { test as base } from '@playwright/test';
import { LoginPage } from '../../pageObject/pages/LoginPage';
import { LogoutLink } from '../../pageObject/components/DrawerMenu';

type TestFixtures = {
  loginPage: LoginPage;
  LogoutLink: LogoutLink;
};

const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  LogoutLink: async ({ page }, use) => use(new LogoutLink(page)),
});

export default test;
