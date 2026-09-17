# saucedemo-tests

Playwright + TypeScript automation for the saucedemo.com UI workflow test cases
(login and shopping cart).

## Setup

```The easiest way to run this script is to clone the repository to your local machine, and navigate to the root folder of the local clone, and use Terminal to execute.

```bash
npm install
npx playwright install --with-deps
```

## Run

```bash
npm test              # headless, all tests
npm run test:headed   # see the browser (recommanded)
npm run test:ui       # Playwright's interactive UI mode
npm run report        # open the last HTML report
```

## How to change login User

```
location: tests/fixtures/data.ts
Change the field of VALID_USERNAME (line 1)
```


## Structure

```
tests/
  fixtures/data.ts   # shared credentials, URLs, expected cart contents
  login.spec.ts       # Login with Wrong Username / Wrong Password / Correct Password
  cart.spec.ts         # Add item, Add all items, Remove first item, View cart (serial)
playwright.config.ts   # baseURL = https://www.saucedemo.com, chromium project
```

## Notes on test cases assertions

- **Login with Wrong Username** — `standarduser` (missing underscore) +
  `secret_sauce` → error banner shown, stays on `/`.
- **Login with Wrong Password** — `standard_user` + `secretsauce` (missing
  underscore) → error banner shown, stays on `/`.
- **Login with Correct Password** — `standard_user` + `secret_sauce` →
  redirected to `/inventory.html`.
- **Remove Items in the Shopping Cart** — from the cart page, remove
  Sauce Labs Bike Light and Sauce Labs Bolt T-Shirt → both gone from the
  list, cart badge shows 3.
- **Checking Out Workflow** — click Checkout → `checkout-step-one.html`,
  fill First Name `Test` / Last Name `User` / Zip `33333`, Continue →
  `checkout-step-two.html` with the 3 remaining items (Fleece Jacket, Onesie,
  Test.allTheThings() T-Shirt (Red)), Finish → `checkout-complete.html` with
  the "Thank you for your order!" message and no cart badge.
- All 6 cart/checkout test cases are order-dependent in the original spec
  (add one → add the rest → remove one → view the cart → remove two more →
  check out), so `cart.spec.ts` uses `test.describe.serial` with one shared,
  authenticated page rather than isolating each test — matching the manual
  flow.
- Selectors prefer saucedemo's stable `data-test` attributes over text/CSS
  where available.
