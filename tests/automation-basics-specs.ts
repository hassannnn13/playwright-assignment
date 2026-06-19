import { expect, test, type Page } from '@playwright/test';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

async function login(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(USERNAME);
  await page.getByPlaceholder('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Login' }).click();
}

test.describe('Part A: Automation Basics', () => {
  test('Login with valid credentials --> lands on inventory page', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="inventory-list"]')).toBeVisible();
  });

  test('Login with invalid password --> shows an error message', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill(USERNAME);
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('Add 2 items to cart --> shows cart badge count 2', async ({ page }) => {
    await login(page);

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  });

  test('Complete checkout --> shows "Thank you for your order!" message', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Hassan');
    await page.locator('[data-test="lastName"]').fill('Idrees');
    await page.locator('[data-test="postalCode"]').fill('75950');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await expect(page.locator('[data-test="complete-header"]')).toHaveText(
      'Thank you for your order!'
    );
  });

  test('Logout --> redirects to login page', async ({ page }) => {
    await login(page);

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('Sort products by Price (Low to High) --> places lower price first', async ({ page }) => {
    await login(page);

    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const prices = page.locator('[data-test="inventory-item-price"]');
    const firstPriceText = await prices.first().innerText();
    const lastPriceText = await prices.last().innerText();
    const firstPrice = Number(firstPriceText.replace('$', ''));
    const lastPrice = Number(lastPriceText.replace('$', ''));

    expect(firstPrice).toBeLessThan(lastPrice);
  });
});
