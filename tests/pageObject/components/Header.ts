import type { Locator, Page } from "@playwright/test";

export class Header {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly burgerButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.burgerButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator("#logout_sidebar_link");
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerButton.click();
    await this.logoutLink.click();
  }
}
