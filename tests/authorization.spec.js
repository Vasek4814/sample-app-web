import { test, expect } from '@playwright/test';
import { fillLogin, USERS } from './helper/login';

test.describe('Авторизация', () => {
  test.beforeEach(async ({ page }) => {
    await fillLogin(page);
  });

  test('Успешный вход с валидными учётными данными', async ({ page }) => {
    await page.locator('#user-name').fill(USERS.standard.username);
    await page.locator('#password').fill(USERS.standard.password);
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Ошибка "Username is required" при пустых полях', async ({ page }) => {
    await page.locator('#user-name').fill(USERS.empty.username);
    await page.locator('#password').fill(USERS.empty.password);
    await page.locator('#login-button').click();
    await expect(page.getByTestId('error')).toContainText('Epic sadface: Username is required');
  });

  test('Ошибка при неверном пароле', async ({ page }) => {
    await page.locator('#user-name').fill(USERS.wrongPassword.username);
    await page.locator('#password').fill(USERS.wrongPassword.password);
    await page.locator('#login-button').click();
    await expect(page.getByTestId('error')).toContainText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('Ошибка для заблокированного пользователя locked_out_user', async ({ page }) => {
    await page.locator('#user-name').fill(USERS.locked.username);
    await page.locator('#password').fill(USERS.locked.password);
    await page.locator('#login-button').click();
    await expect(page.getByTestId('error')).toContainText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  test('Сообщение об ошибке закрывается по клику на иконку X', async ({ page }) => {
    await page.locator('#user-name').fill(USERS.locked.username);
    await page.locator('#password').fill(USERS.locked.password);
    await page.locator('#login-button').click();
    await page.locator('svg[data-icon="xmark"]').click();
    await expect(page.getByTestId('error')).toBeHidden();
  });

  test('После logout прямой переход на /inventory.html перенаправляет на страницу логина', async ({
    page,
  }) => {
    await page.locator('#user-name').fill(USERS.standard.username);
    await page.locator('#password').fill(USERS.standard.password);
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory\.html/);

    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await page.goto('https://www.saucedemo.com/inventory.html');

    await expect(page.getByTestId('error')).toContainText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });
});
