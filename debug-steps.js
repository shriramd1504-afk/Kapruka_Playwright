const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const log = (msg) => console.log(new Date().toISOString(), msg);

  try {
    log('start');
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    log('goto login ok');
    await page.getByPlaceholder('Enter email').fill(process.env.TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    log('filled form');
    await page.locator('input[type="submit"][value="Login"]').click();
    log('clicked login');
    await page.waitForURL(/accountView\.jsp|accountLogin\.jsp|error/, { timeout: 30000 });
    log('url after login=' + page.url());

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);
    log('after search wait');

    const firstCake = page.locator('.catalogueV2Repeater').first();
    await firstCake.waitFor({ state: 'visible', timeout: 30000 });
    log('first cake visible');
    await firstCake.click();
    log('clicked first cake');

    await page.waitForTimeout(4000);
    const addButton = page.locator('button[id="addtocartbutton"]');
    await addButton.waitFor({ state: 'visible', timeout: 30000 });
    log('add button visible');
    await addButton.click();
    log('clicked add to cart');

    const viewCart = page.getByRole('link', { name: 'View Cart' }).first();
    await viewCart.waitFor({ state: 'visible', timeout: 30000 });
    log('view cart visible');
    await viewCart.click();
    log('clicked view cart');

    const checkout = page.locator("//button[@class='checkoutBtn js-checkout']").first();
    await checkout.waitFor({ state: 'visible', timeout: 30000 });
    log('checkout visible');
    await checkout.click();
    log('clicked checkout');

    await page.locator('#to_name_field').waitFor({ state: 'visible', timeout: 30000 });
    log('delivery form visible');

    await page.locator('#to_name_field').fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();
    log('address fields done');

    const dateInput = page.locator('#delivery_date');
    await dateInput.waitFor({ state: 'visible', timeout: 30000 });
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const val = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
    await dateInput.fill(val);
    log('date filled=' + await dateInput.inputValue());

    const cta = page.locator('button:has-text("Continue"), input[value="Continue"], input[name="Continue"], a:has-text("Continue")').first();
    await cta.waitFor({ state: 'visible', timeout: 30000 });
    log('continue visible=' + await cta.textContent());
    await cta.click();
    log('clicked continue');

    await page.waitForTimeout(5000);
    log('after continue url=' + page.url());
    log('body snippet=' + (await page.locator('body').innerText()).slice(0, 2000));
  } catch (err) {
    console.error('ERROR', err.stack || err.message);
    await page.screenshot({ path: 'debug-steps-failure.png', fullPage: true });
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
