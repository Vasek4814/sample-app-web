import type { Locator, Page } from '@playwright/test';

export class LogoutLink {
  readonly burgerButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.burgerButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async logout(): Promise<void> {
    await this.burgerButton.click();
    await this.logoutLink.click();
  }
}
