import { test, expect } from './slider.fixture';

test.describe('Dynamic catalog slider', () => {
  test.beforeEach(async ({ prepareSession, drawerMenu, sliderPage }) => {
    await prepareSession();
    await drawerMenu.goToSlider();
    await sliderPage.waitForLoaded();
  });
  test('Отображается 6 точек', async ({ sliderPage }) => {
    expect(await sliderPage.getDotsCount()).toBe(6);
  });
  test('Активна ровно одна точка', async ({ sliderPage }) => {
    await sliderPage.expectOnlyOneActiveDot();
  });

  test('По умолчанию активен слайд #1 (Bolt T-Shirt)', async ({ sliderPage }) => {
    await sliderPage.expectActiveDot(1);
    expect(await sliderPage.getCurrentItemName()).toMatch(/Bolt T-Shirt/);
  });

  test('Клик по 3-й точке переключает слайд', async ({ sliderPage }) => {
    const before = await sliderPage.getCurrentItemName();
    await sliderPage.clickDot(3);
    await sliderPage.expectActiveDot(3);
    const after = await sliderPage.getCurrentItemName();
    expect(after).not.toBe(before);
    const ariaLabel = await sliderPage.btnActiveDot.getAttribute('aria-label');
    expect(ariaLabel).toContain(after);
  });

  test('Прогон по всем точкам: имя совпадает с aria-label', async ({ sliderPage }) => {
    const count = await sliderPage.getDotsCount();

    for (let i = 0; i < count; i++) {
      await sliderPage.clickDot(i);
      await sliderPage.expectActiveDot(i);
      const name = await sliderPage.getCurrentItemName();
      const label = await sliderPage.dot(i).getAttribute('aria-label');
      expect(label).toContain(name);
    }
  });

  test('Повторный клик по активной точке не ломает слайдер', async ({ sliderPage }) => {
    const before = await sliderPage.getActiveDotTestId();
    await sliderPage.btnActiveDot.click();
    await sliderPage.btnActiveDot.click();
    expect(await sliderPage.getActiveDotTestId()).toBe(before);
  });
});
