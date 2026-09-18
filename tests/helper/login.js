import { expect } from '@playwright/test';

export async function login(page) {
  await page.goto('http://localhost:3000/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/.*inventory\.html/);
}
