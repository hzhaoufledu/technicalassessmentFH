import { test, expect } from '@playwright/test';
import {
  VALID_USERNAME,
  VALID_PASSWORD,
  INVALID_USERNAME,
  INVALID_PASSWORD,
  INVENTORY_URL,
} from './fixtures/data';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Login with Wrong Username', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(INVALID_USERNAME);
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    // Fail to login: stays on the login page, error banner is shown
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('Login with Wrong Password', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill(INVALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    // Fail to login: stays on the login page, error banner is shown
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText(
      'Username and password do not match any user in this service'
    );
  });

  test('Login with Correct Password', async ({ page }) => {
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();

    // Logged into the website correctly
    await expect(page).toHaveURL(INVENTORY_URL);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});
