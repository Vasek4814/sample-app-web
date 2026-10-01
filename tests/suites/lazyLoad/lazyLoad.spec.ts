import { test, expect } from './lazyLoad.fixture';

test.describe('Lazy Load — бесконечный скролл', () => {
  test.beforeEach(async ({ prepareSession, drawerMenu, page }) => {
    await prepareSession();
    await drawerMenu.goToLazyLoad();
    await expect(page.getByTestId('dynamic-catalog-lazy-load-container')).toBeVisible();
  });

  test('При переходе на страницу уже есть карточки товара', async ({ lazyLoadPage }) => {
    await expect(lazyLoadPage.items.first()).toBeVisible();
  });

  test('Скролл подгружает новые карточки', async ({ lazyLoadPage }) => {
    await expect(lazyLoadPage.items.first()).toBeVisible();
    const countBefore = await lazyLoadPage.getItemsCount();
    const indexBefore = await lazyLoadPage.getLastIndex();
    await lazyLoadPage.scrollBy(5);
    const countAfter = await lazyLoadPage.getItemsCount();
    const indexAfter = await lazyLoadPage.getLastIndex();
    expect(countAfter).toBeGreaterThan(countBefore);
    expect(indexAfter).toBeGreaterThan(indexBefore);
  });
});
