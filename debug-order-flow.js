const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const email = process.env.TEST_EMAIL;
  const pass = process.env.TEST_PASSWORD;

  try {
    console.log('1. Home');
    await page.goto('https://kapruka.com');
    await page.getByRole('link', { name: 'My Account' }).click();
    await page.getByPlaceholder('Email address').fill(email);
    await page.getByPlaceholder('Password').fill(pass);
    await page.getByRole('button', { name: 'LOGIN' }).click();
    await page.waitForURL(/kapruka\.com/, { timeout: 30000 });
    console.log('2. Logged in');

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
    console.log('3. Search done');

    await page.locator('.catalogueV2Repeater').first().click();
    console.log('4. Product selected');
    await page.waitForTimeout(2500);
    await page.locator('button[id="addtocartbutton"]').click();
    console.log('5. Added to cart');
    await page.getByRole('link', { name: 'View Cart' }).click();
    console.log('6. View cart');
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();
    console.log('7. Delivery form');

    await page.getByPlaceholder('Name').first().fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
    const input = page.getByLabel(/Delivery Date/i).first();
    await input.waitFor({ state: 'visible', timeout: 20000 });
    console.log('8. Date input visible');
    await input.click();
    await input.fill(formatted);
    await input.press('Tab');
    console.log('9. Date set:', formatted);

    await page.getByRole('button', { name: 'Continue' }).click();
    console.log('10. Continue clicked');
    await page.waitForURL(/deliveryCartFinalPage\.jsp/, { timeout: 20000 });
    console.log('11. Final page loaded');

    const checkbox = page.locator('label:has-text("I agree with this delivery date") input[type="checkbox"]').first();
    await checkbox.waitFor({ state: 'visible', timeout: 20000 });
    await checkbox.check();
    console.log('12. Checkbox checked');

    const btn = page.locator("input[name='Proceed to Checkout']");
    await btn.waitFor({ state: 'visible', timeout: 20000 });
    await btn.click();
    console.log('13. Proceed clicked');
    await page.waitForURL(/securePayment\.jsp/, { timeout: 20000 });
    console.log('14. Secure payment page loaded');

    await page.screenshot({ path: 'debug-checkout-flow.png', fullPage: true });
    console.log('SUCCESS');
  } catch (e) {
    console.error('ERROR:', e.message);
    await page.screenshot({ path: 'debug-checkout-flow-failure.png', fullPage: true });
    throw e;
  } finally {
    await browser.close();
  }
})();
