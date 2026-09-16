// import { test, expect } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('https://www.saucedemo.com/');
// });

// test.describe('Успешная авторизация с валидными учётными данными', () => {
//   test(`Успешный вход под пользователем`, async ({ page }) => {
//     await test.step('Ввод логина и пароля', async () => {
//       await page.locator('#user-name').fill('standard_user');
//       await page.locator('#password').fill('secret_sauce');
//     });
//     await test.step('Нажатие кнопки Login', async () => {
//       await expect(page.locator('#login-button')).toBeVisible();
//       await page.locator('#login-button').click();
//     });
//     await test.step('Открывается страница каталога /inventory.html', async () => {
//       await expect(page).toHaveURL(/.*inventory.html/);
//     });
//   });
// });

// test.describe('Авторизация с пустыми полями', () => {
//   test('Отображение ошибки "Username is required" при пустых полях', async ({ page }) => {
//     await test.step('Оставить поля логина и пароля пустыми', async () => {
//       await page.locator('#user-name').fill('');
//       await page.locator('#password').fill('');
//     });
//     await test.step('Нажатие кнопки Login', async () => {
//       await expect(page.locator('#login-button')).toBeVisible();
//       await page.locator('#login-button').click();
//     });
//     await test.step('Отображается сообщение об ошибке', async () => {
//       await expect(page.locator('[data-test="error"]')).toContainText(
//         'Epic sadface: Username is required',
//       );
//     });
//   });
// });

// test.describe('Авторизация с неверным паролем', () => {
//   test('Отображение ошибки при неверной паре логин/пароль', async ({ page }) => {
//     await test.step('Ввод неверного пароля', async () => {
//       await page.locator('#user-name').fill('standard_user');
//       await page.locator('#password').fill('secretsauce');
//     });
//     await test.step('Нажатие кнопки Login', async () => {
//       await expect(page.locator('#login-button')).toBeVisible();
//       await page.locator('#login-button').click();
//     });
//     await test.step('Отображается сообщение об ошибке', async () => {
//       await expect(page.locator('[data-test="error"]')).toContainText(
//         'Epic sadface: Username and password do not match any user in this service',
//       );
//     });
//   });
// });

// test.describe('Авторизация заблокированного пользователя', () => {
//   test('Отображение ошибки для locked_out_user', async ({ page }) => {
//     await test.step('Ввод логина и пароля locked_out_user', async () => {
//       await page.locator('#user-name').fill('locked_out_user');
//       await page.locator('#password').fill('secret_sauce');
//     });
//     await test.step('Нажатие кнопки Login', async () => {
//       await expect(page.locator('#login-button')).toBeVisible();
//       await page.locator('#login-button').click();
//     });
//     await test.step('Отображается сообщение о блокировке', async () => {
//       await expect(page.locator('[data-test="error"]')).toContainText(
//         'Epic sadface: Sorry, this user has been locked out.',
//       );
//     });
//   });
// });

// test.describe('Закрытие сообщения об ошибке', () => {
//   test('Сообщение об ошибке скрывается по клику на иконку X', async ({ page }) => {
//     await test.step('Авторизация под locked_out_user', async () => {
//       await page.locator('#user-name').fill('locked_out_user');
//       await page.locator('#password').fill('secret_sauce');
//       await expect(page.locator('#login-button')).toBeVisible();
//       await page.locator('#login-button').click();
//     });
//     await test.step('Закрытие ошибки по клику на X', async () => {
//       await expect(page.locator('[data-test="error"]')).toBeVisible();
//       await expect(page.locator('svg[data-icon="xmark"]')).toBeVisible();
//       await page.locator('svg[data-icon="xmark"]').click();
//       await expect(page.locator('[data-test="error"]')).toBeHidden();
//     });
//   });
// });

// test('Прямой переход на /inventory.html после logout возвращает на страницу логина', async ({
//   page,
// }) => {
//   await test.step('Авторизация под standard_user', async () => {
//     await page.locator('#user-name').fill('standard_user');
//     await page.locator('#password').fill('secret_sauce');
//     await expect(page.locator('#login-button')).toBeVisible();
//     await page.locator('#login-button').click();
//     await expect(page).toHaveURL(/.*inventory.html/);
//   });
//   await test.step('Выход из системы', async () => {
//     await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
//     await page.locator('#react-burger-menu-btn').click();
//     await page.locator('#logout_sidebar_link').click();
//   });
//   await test.step('Переход на /inventory.html без авторизации', async () => {
//     await page.goto('https://saucedemo.com/inventory.html');
//   });
//   await test.step('Отображается ошибка о необходимости авторизации', async () => {
//     await expect(page.locator('[data-test="error"]')).toContainText(
//       "Epic sadface: You can only access '/inventory.html' when you are logged in.",
//     );
//   });
// });

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
