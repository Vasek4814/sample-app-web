import { BasePage } from "./BasePage";

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  zip: string;
}

export class CheckoutPage extends BasePage {
  readonly url = "/checkout-step-one.html";
  readonly firstNameInput = this.page.getByPlaceholder("First Name");
  readonly lastNameInput = this.page.getByPlaceholder("Last Name");
  readonly zipInput = this.page.getByPlaceholder("Zip/Postal Code");
  readonly continueButton = this.page.locator("#continue");
  readonly finishButton = this.page.getByRole("button", { name: "Finish" });
  readonly cancelButton = this.page.getByRole("button", { name: "Cancel" });
  readonly backHomeButton = this.page.getByRole("button", {
    name: "Back Home",
  });
  readonly subtotalLabel = this.page.getByTestId("subtotal-label");
  readonly taxLabel = this.page.getByTestId("tax-label");
  readonly totalLabel = this.page.getByTestId("total-label");
  readonly completeHeader = this.page.getByTestId("complete-header");
  readonly error = this.page.getByTestId("error");

  async fillForm(data: CheckoutFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.zipInput.fill(data.zip);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /** Считывает суммы с Overview и парсит их в числа. */
  async readAmounts(): Promise<{
    subtotal: number;
    tax: number;
    total: number;
  }> {
    const toNumber = (text: string) => Number(text.replace(/[^\d.]/g, ""));
    const [subtotalText, taxText, totalText] = await Promise.all([
      this.subtotalLabel.textContent(),
      this.taxLabel.textContent(),
      this.totalLabel.textContent(),
    ]);
    return {
      subtotal: toNumber(subtotalText ?? ""),
      tax: toNumber(taxText ?? ""),
      total: toNumber(totalText ?? ""),
    };
  }
}
