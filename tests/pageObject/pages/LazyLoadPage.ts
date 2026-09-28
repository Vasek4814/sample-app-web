import type { Locator, Page } from '@playwright/test';

export class LazyLoadPage {
  readonly page: Page;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.locator('[data-testid^="lazy-load-item-"]');
  }
  async scrollBy(times = 5): Promise<void> {
    for (let i = 0; i < times; i++) {
      const countBefore = await this.items.count();

      await this.page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await this.page
        .waitForFunction(
          (prev) => document.querySelectorAll('[data-testid^="lazy-load-item-"]').length > prev,
          countBefore,
          { timeout: 2000 },
        )
        .catch(() => {});
    }
  }
  async getItemsCount(): Promise<number> {
    return this.items.count();
  }
  async getLastIndex(): Promise<number> {
    const ids = await this.items.evaluateAll((els) =>
      els.map((el) => el.getAttribute('data-testid') ?? ''),
    );
    return Math.max(...ids.map((id) => parseInt(id.replace('lazy-load-item-', ''), 10) || 0));
  }
}
