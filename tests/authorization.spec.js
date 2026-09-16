import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
});

test.describe('Авторизация', () => {
  test('Успешный вход с валидными учётными данными', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Ошибка "Username is required" при пустых полях', async ({ page }) => {
    await page.locator('#user-name').fill('');
    await page.locator('#password').fill('');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username is required',
    );
  });

  test('Ошибка при неверном пароле', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secretsauce');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('Ошибка для заблокированного пользователя locked_out_user', async ({ page }) => {
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  test('Сообщение об ошибке закрывается по клику на иконку X', async ({ page }) => {
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await page.locator('svg[data-icon="xmark"]').click();
    await expect(page.locator('[data-test="error"]')).toBeHidden();
  });
});

test('После logout прямой переход на /inventory.html перенаправляет на страницу логина', async ({
  page,
}) => {
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/.*inventory.html/);

  await page.locator('#react-burger-menu-btn').click();
  await page.locator('#logout_sidebar_link').click();

  await page.goto('https://saucedemo.com/inventory.html');

  await expect(page.locator('[data-test="error"]')).toContainText(
    "Epic sadface: You can only access '/inventory.html' when you are logged in.",
  );
});
