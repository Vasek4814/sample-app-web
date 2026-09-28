import type { Locator, Page } from '@playwright/test';

export class DrawerMenu {
  readonly burgerButton: Locator;
  readonly burgerButtonClose: Locator;
  readonly logoutLink: Locator;
  readonly allItems: Locator;
  readonly aboutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly dynamicCatalog: Locator;
  readonly lazyLoad: Locator;
  readonly slider: Locator;

  constructor(page: Page) {
    this.burgerButton = page.getByRole('button', { name: 'Open Menu' });
    this.burgerButtonClose = page.getByRole('button', { name: 'Close Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.allItems = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.dynamicCatalog = page.getByTestId('dynamic-catalog-sidebar-link');
    this.lazyLoad = page.getByTestId('dynamic-catalog-lazy-load-link');
    this.slider = page.getByTestId('dynamic-catalog-slider-link');
  }

  async goToAllItems(): Promise<void> {
    await this.burgerButton.click();
    await this.allItems.click();
  }

  async goToDynamicCatalog(): Promise<void> {
    await this.burgerButton.click();
    await this.dynamicCatalog.click();
  }

  async goToLazyLoad(): Promise<void> {
    await this.burgerButton.click();
    await this.dynamicCatalog.click();
    await this.lazyLoad.click();
  }
  async goToSlider(): Promise<void> {
    await this.burgerButton.click();
    await this.dynamicCatalog.click();
    await this.slider.click();
  }

  async clickAbout(): Promise<void> {
    await this.burgerButton.click();
    await this.aboutLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerButton.click();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.burgerButton.click();
    await this.resetAppStateLink.click();
    await this.burgerButtonClose.click();
  }
}
