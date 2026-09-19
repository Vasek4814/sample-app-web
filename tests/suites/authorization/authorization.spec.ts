import { expect } from "@playwright/test";
import { ROUTES, URL_PATTERN } from "../../constants/routes";
import { USERS } from "../../data/users";
import test from "./authorization.fixture";

test.describe("Авторизация", () => {
  test("Успешный вход с валидными учётными данными", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.valid);
    await expect(loginPage.page).toHaveURL(URL_PATTERN.INVENTORY);
  });

  test('Ошибка "Username is required" при пустых полях', async ({
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login(USERS.empty);
    await expect(loginPage.error).toContainText(
      "Epic sadface: Username is required"
    );
  });

  test("Ошибка при неверном пароле", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.wrongPassword);
    await expect(loginPage.error).toContainText(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("Ошибка для заблокированного пользователя locked_out_user", async ({
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login(USERS.locked);
    await expect(loginPage.error).toContainText(
      "Epic sadface: Sorry, this user has been locked out."
    );
  });

  test("Сообщение об ошибке закрывается по клику на иконку X", async ({
    loginPage,
  }) => {
    await loginPage.open();
    await loginPage.login(USERS.locked);
    await loginPage.closeError();
    await expect(loginPage.error).toBeHidden();
  });

  test("После logout прямой переход на /inventory.html перенаправляет на страницу логина", async ({
    page,
    loginPage,
    header,
  }) => {
    await loginPage.open();
    await loginPage.login(USERS.valid);
    await expect(page).toHaveURL(URL_PATTERN.INVENTORY);

    await header.logout();
    await page.goto(ROUTES.INVENTORY);

    await expect(loginPage.error).toContainText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });
});
