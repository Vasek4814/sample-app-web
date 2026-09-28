import { test, expect } from './drawerMenu.fixture';
import { ROUTES, URL_PATTERN } from '../../constants/routes';

test.describe('Меню и навигация', () => {
  test.beforeEach(async ({ prepareSession }) => {
    await prepareSession();
  });
  test('BurgerMenu открывается и закрывается', async ({ drawerMenu }) => {
    await drawerMenu.burgerButton.click();
    await drawerMenu.burgerButtonClose.click();
  });
  test('All items возвращает в каталог', async ({ drawerMenu, header, page }) => {
    await header.openCart();
    await drawerMenu.goToAllItems();
    await expect(page).toHaveURL(URL_PATTERN.INVENTORY);
  });
  test('Проверка вложенных ссылок в dynamic catalog', async ({ drawerMenu }) => {
    await drawerMenu.goToDynamicCatalog();
    expect(drawerMenu.lazyLoad);
    expect(drawerMenu.spinner);
    expect(drawerMenu.slider);
  });

  test('About открывает внешнюю ссылку saucelabs.com', async ({ drawerMenu, page }) => {
    await drawerMenu.clickAbout();
    await expect(page).toHaveURL(URL_PATTERN.ABOUT_URL);
  });
  test('Reset app state очищает корзину', async ({ drawerMenu, prepareCart, header }) => {
    await prepareCart();
    await drawerMenu.resetAppState();
    await expect(header.cartBadge).toBeHidden();
  });
  test('Logout разлогинивает и возвращает на форму логина', async ({ drawerMenu, page }) => {
    await drawerMenu.logout();
    await expect(page).toHaveURL(ROUTES.LOGIN);
  });
});
