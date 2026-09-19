import type { Page } from '@playwright/test';
import type { Route } from '../../constants/routes';

export abstract class BasePage {
  readonly page: Page;
  abstract readonly url: Route;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.url);
  }
}
