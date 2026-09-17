import { test, expect, Page } from '@playwright/test';
import {
  VALID_USERNAME,
  VALID_PASSWORD,
  CART_URL,
  EXPECTED_CART_ITEMS,
  EXPECTED_CART_ITEMS_AFTER_REMOVAL,
  CHECKOUT_STEP_ONE_URL,
  CHECKOUT_STEP_TWO_URL,
  CHECKOUT_COMPLETE_URL,
  CHECKOUT_INFO,
} from './fixtures/data';

// These cases build on each other (item added -> all added -> first removed ->
// cart checked), exactly like the manual test flow, so they run serially
// against one shared page instead of independent isolated tests.
test.describe.serial('Shopping Cart', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
    await page.locator('[data-test="username"]').fill(VALID_USERNAME);
    await page.locator('[data-test="password"]').fill(VALID_PASSWORD);
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Add An Item to Shopping Cart', async () => {
    const backpackButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    await backpackButton.click();

    // "Add to cart" button becomes "Remove"
    await expect(
      page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();

    // Cart badge shows 1
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('Add All Items to the Shopping Cart', async () => {
    // The remaining 5 "Add to cart" buttons (backpack already added)
    const remainingAddButtons = page.locator(
      'button:has-text("Add to cart")'
    );
    await expect(remainingAddButtons).toHaveCount(5);

    const count = await remainingAddButtons.count();
    for (let i = 0; i < count; i++) {
      // Always click the first remaining "Add to cart" button, since each
      // click turns one into "Remove" and shifts the rest up.
      await remainingAddButtons.first().click();
    }

    // Every button on the page is now a "Remove" button
    await expect(page.locator('button:has-text("Add to cart")')).toHaveCount(
      0
    );
    await expect(page.locator('button:has-text("Remove")')).toHaveCount(6);

    // Cart badge shows 6
    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
  });

  test('Remove the First Item', async () => {
    const backpackRemoveButton = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );
    await backpackRemoveButton.click();

    // "Remove" button becomes "Add to Cart" again
    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toBeVisible();

    // Cart badge shows 5
    await expect(page.locator('.shopping_cart_badge')).toHaveText('5');
  });

  test('Shopping Cart Items', async () => {
    await page.locator('.shopping_cart_link').click();

    // Directed to the cart page
    await expect(page).toHaveURL(CART_URL);

    // Five items remain in the cart, matching the expected set
    const itemNames = page.locator('.cart_item .inventory_item_name');
    await expect(itemNames).toHaveCount(5);

    const actualNames = await itemNames.allTextContents();
    expect(actualNames.sort()).toEqual([...EXPECTED_CART_ITEMS].sort());
  });

  test('Remove Items in the Shopping Cart', async () => {
    await page
      .locator('[data-test="remove-sauce-labs-bike-light"]')
      .click();
    await page
      .locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')
      .click();

    // Both items are now removed from the list
    await expect(
      page.locator('[data-test="remove-sauce-labs-bike-light"]')
    ).toHaveCount(0);
    await expect(
      page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')
    ).toHaveCount(0);

    const remainingNames = await page
      .locator('.cart_item .inventory_item_name')
      .allTextContents();
    expect(remainingNames.sort()).toEqual(
      [...EXPECTED_CART_ITEMS_AFTER_REMOVAL].sort()
    );

    // Cart badge shows 3
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('Checking Out Workflow', async () => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(CHECKOUT_STEP_ONE_URL);

    await page
      .locator('[data-test="firstName"]')
      .fill(CHECKOUT_INFO.firstName);
    await page.locator('[data-test="lastName"]').fill(CHECKOUT_INFO.lastName);
    await page
      .locator('[data-test="postalCode"]')
      .fill(CHECKOUT_INFO.postalCode);
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(CHECKOUT_STEP_TWO_URL);

    // Three items remain, matching what's left in the cart
    const summaryNames = page.locator('.cart_item .inventory_item_name');
    await expect(summaryNames).toHaveCount(3);
    const actualSummaryNames = await summaryNames.allTextContents();
    expect(actualSummaryNames.sort()).toEqual(
      [...EXPECTED_CART_ITEMS_AFTER_REMOVAL].sort()
    );

    await page.locator('[data-test="finish"]').click();

    await expect(page).toHaveURL(CHECKOUT_COMPLETE_URL);
    await expect(page.locator('.complete-header')).toHaveText(
      'Thank you for your order!'
    );

    // Cart icon shows no number now
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
