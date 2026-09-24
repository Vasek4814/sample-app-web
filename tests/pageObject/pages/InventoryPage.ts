import { BasePage } from './BasePage';

export const SORT_OPTION = {
  az: 'az',
  za: 'za',
  lohi: 'lohi',
  hilo: 'hilo',
} as const;

export type SortOption = (typeof SORT_OPTION)[keyof typeof SORT_OPTION];

export class InventoryPage extends BasePage {
  readonly url = '/inventory.html';
  readonly items = this.page.getByTestId('inventory-item');
  readonly itemNames = this.page.getByTestId('inventory-item-name');
  readonly itemPrices = this.page.getByTestId('inventory-item-price');
  readonly itemImages = this.page.getByTestId(/-img$/);
  readonly sortSelect = this.page.getByTestId('product-sort-container');
  readonly detailsContainer = this.page.getByTestId('inventory-item');
  readonly addToCartButtons = this.page.getByTestId(/^add-to-cart-/);
  readonly removeButtons = this.page.getByTestId(/^remove-/);

  itemByIndex(index: number) {
    return this.items.nth(index);
  }

  async addToCart(count = 1): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addToCartButtons.first().click();
    }
  }

  async sort(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }
}
