const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const email = process.env.TEST_EMAIL;
  const pass = process.env.TEST_PASSWORD;

  const log = (msg) => console.log(new Date().toISOString(), msg);

  try {
    log('1. goto login page');
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    log('login title=' + await page.title());
    await page.getByPlaceholder('Email address').waitFor({ state: 'visible', timeout: 30000 });
    log('2. fill login');
    await page.getByPlaceholder('Email address').fill(email);
    await page.getByPlaceholder('Password').fill(pass);
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await page.waitForTimeout(5000);
    log('after login url=' + page.url());

    log('4. search cake');
    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    log('search page loaded');

    log('5. select first cake');
    await page.locator('.catalogueV2Repeater').first().click();
    log('selected product');
    await page.waitForTimeout(3000);

    log('6. add to cart');
    await page.locator('button[id="addtocartbutton"]').click();
    await page.getByText('Item added to the cart.').waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('link', { name: 'View Cart' }).click();
    log('view cart clicked');

    log('7. checkout');
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();
    log('checkout page loaded');

    log('8. recipient info');
    await page.locator('#to_name_field').fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const dateInput = page.locator('input[placeholder="Delivery Date *"], input[aria-label*="Delivery Date" i], input[name*="deliveryDate" i], input[id*="deliveryDate" i]').first();
    await dateInput.waitFor({ state: 'visible', timeout: 30000 });
    log('date field visible');
    await dateInput.fill(formatted);
    await dateInput.press('Tab');
    log('date set = ' + formatted + ' actual=' + await dateInput.inputValue());

    await page.getByRole('button', { name: 'Continue' }).click();
    log('9. continue clicked');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    log('after continue url=' + page.url());

    log('10. order preview');
    const checkbox = page.locator('#warning_confirm_checkbox');
    await checkbox.waitFor({ state: 'visible', timeout: 30000 });
    await checkbox.check();
    await page.locator("input[name='Proceed to Checkout']").click();
    log('11. proceeded to payment');
    await page.waitForURL(/securePayment\.jsp|securePayment|checkout\//, { timeout: 30000 });
    log('payment page url=' + page.url());

    await page.screenshot({ path: 'debug-final.png', fullPage: true });
    log('SUCCESS');
  } catch (error) {
    log('ERROR: ' + error.message);
    await page.screenshot({ path: 'debug-failure.png', fullPage: true });
    console.error(error.stack);
    throw error;
  } finally {
    await browser.close();
  }
})();
