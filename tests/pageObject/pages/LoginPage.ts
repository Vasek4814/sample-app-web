import { ROUTES } from '../../constants/routes';
import type { TestUser } from '../../data/users';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = ROUTES.LOGIN;
  readonly usernameInput = this.page.getByTestId('username');
  readonly passwordInput = this.page.getByTestId('password');
  readonly loginButton = this.page.getByTestId('login-button');
  readonly error = this.page.getByTestId('error');
  readonly errorCloseButton = this.page.getByTestId('error-button');

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
