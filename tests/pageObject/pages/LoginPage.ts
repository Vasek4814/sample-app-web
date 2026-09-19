import { ROUTES } from "../../constants/routes";
import type { TestUser } from "../../data/users";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly url = ROUTES.LOGIN;
  readonly usernameInput = this.page.locator("#user-name");
  readonly passwordInput = this.page.locator("#password");
  readonly loginButton = this.page.locator("#login-button");
  readonly error = this.page.getByTestId("error");
  readonly errorCloseButton = this.page.locator('svg[data-icon="xmark"]');

  async login(user: TestUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }

  async fillLoginForm(user: TestUser): Promise<void> {
    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
  }

  async closeError(): Promise<void> {
    await this.errorCloseButton.click();
  }
}
