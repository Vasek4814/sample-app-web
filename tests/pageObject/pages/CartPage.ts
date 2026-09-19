import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly url = "/cart.html";
  readonly items = this.page.getByTestId("inventory-item");
  readonly itemNames = this.page.getByTestId("inventory-item-name");
  readonly itemPrices = this.page.getByTestId("inventory-item-price");
  readonly checkoutButton = this.page.getByRole("button", { name: "Checkout" });
  readonly continueShoppingButton = this.page.getByRole("button", {
    name: "Continue Shopping",
  });
  readonly removeButtons = this.page.getByRole("button", { name: "Remove" });

  async removeAllItems(): Promise<void> {
    while ((await this.removeButtons.count()) > 0) {
      await this.removeButtons.first().click();
    }
  }
}
