export const VALID_USERNAME = 'standard_user';
export const VALID_PASSWORD = 'secret_sauce';

export const INVALID_USERNAME = 'standarduser'; // missing underscore
export const INVALID_PASSWORD = 'secretsauce'; // missing underscore

export const INVENTORY_URL = 'https://www.saucedemo.com/inventory.html';
export const CART_URL = 'https://www.saucedemo.com/cart.html';

export const EXPECTED_CART_ITEMS = [
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

// After removing Bike Light and Bolt T-Shirt from the cart
export const EXPECTED_CART_ITEMS_AFTER_REMOVAL = [
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

export const CHECKOUT_STEP_ONE_URL =
  'https://www.saucedemo.com/checkout-step-one.html';
export const CHECKOUT_STEP_TWO_URL =
  'https://www.saucedemo.com/checkout-step-two.html';
export const CHECKOUT_COMPLETE_URL =
  'https://www.saucedemo.com/checkout-complete.html';

export const CHECKOUT_INFO = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '33333',
};
