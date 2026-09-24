import type { Locator, Page } from '@playwright/test';

export class Header {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly burgerButton: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.burgerButton = page.getByTestId('open-menu');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
