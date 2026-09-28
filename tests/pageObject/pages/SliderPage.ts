import { Page, Locator, expect } from '@playwright/test';

export class SliderPage {
  readonly page: Page;
  //   readonly container: Locator;
  readonly sliderItem: Locator;
  readonly sliderItemName: Locator;
  readonly sliderItemPrice: Locator;
  readonly sliderItemImage: Locator;
  readonly sliderDots: Locator;

  readonly btnActiveDot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sliderItem = page.getByTestId('dynamic-catalog-slider-item');
    this.sliderItemName = page.getByTestId('dynamic-catalog-slider-item-name');
    this.sliderItemPrice = page.getByTestId('dynamic-catalog-slider-item-price');
    this.sliderItemImage = page.getByTestId('dynamic-catalog-slider-item-img');
    this.sliderDots = page.getByTestId('dynamic-catalog-slider-dots');
    this.btnActiveDot = this.sliderDots.locator('button.active');
  }
  dot(index: number): Locator {
    return this.page.getByTestId(`dynamic-catalog-slider-dot-${index}`);
  }
  async getDotsCount(): Promise<number> {
    await expect(this.sliderDots.locator('button').first()).toBeVisible();
    return this.sliderDots.locator('button').count();
  }

  async waitForLoaded() {
    await expect(this.sliderDots).toBeVisible();
    await expect(this.sliderDots.locator('button').first()).toBeVisible();
  }

  async clickDot(index: number) {
    await this.dot(index).click();
  }

  async getActiveDotTestId(): Promise<string | null> {
    return this.btnActiveDot.getAttribute('data-testid');
  }

  async getCurrentItemName(): Promise<string> {
    return (await this.sliderItemName.textContent())?.trim() ?? '';
  }

  async getCurrentItemPrice(): Promise<string> {
    return (await this.sliderItemPrice.textContent())?.trim() ?? '';
  }

  async expectActiveDot(index: number) {
    await expect(this.btnActiveDot).toHaveAttribute(
      'data-testid',
      `dynamic-catalog-slider-dot-${index}`,
    );
    await expect(this.btnActiveDot).toHaveAttribute('aria-current', 'true');
  }

  async expectOnlyOneActiveDot() {
    await expect(this.btnActiveDot).toHaveCount(1);
  }
}
