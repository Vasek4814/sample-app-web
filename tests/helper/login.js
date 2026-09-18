import { expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000/';

export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
  wrongPassword: { username: 'standard_user', password: 'secretsauce' },
  empty: { username: '', password: '' },
};

export async function openLoginPage(page) {
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(BASE_URL + '/');
}

/**
 * Полный успешный логин — используется в cart.spec.js и checkout.spec.js.
 */
export async function fillLogin(page) {
  await openLoginPage(page);
  await page.locator('#user-name').fill(USERS.standard.username);
  await page.locator('#password').fill(USERS.standard.password);
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/.*inventory\.html/);
}
