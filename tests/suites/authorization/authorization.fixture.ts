import { test as base } from '@playwright/test';
import { Header } from '../../pageObject/components/Header';
import { LoginPage } from '../../pageObject/pages/LoginPage';

type TestFixtures = {
  loginPage: LoginPage;
  header: Header;
};

const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  header: async ({ page }, use) => use(new Header(page)),
});

export default test;
