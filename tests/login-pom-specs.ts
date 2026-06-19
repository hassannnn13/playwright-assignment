import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Part B: Page Object Model', () => {
  test('Positive login using LoginPage class lands on inventory page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await loginPage.expectInventoryPage();
  });

  test('Negative login using LoginPage class shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'wrong_password');

    await loginPage.expectErrorMessage('Username and password do not match');
  });
});
