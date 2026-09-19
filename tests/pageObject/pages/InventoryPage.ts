import { BasePage } from './BasePage';

/** Значения селекта сортировки каталога. */
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
  readonly itemImages = this.page.locator('img.inventory_item_img');
  readonly sortSelect = this.page.locator('select.product_sort_container');
  readonly detailsContainer = this.page.locator('.inventory_details_container');
  readonly addToCartButtons = this.page.getByRole('button', { name: 'Add to cart' });
  readonly removeButtons = this.page.getByRole('button', { name: 'Remove' });

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
