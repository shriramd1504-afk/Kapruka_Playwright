const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  const log = (msg) => console.log(new Date().toISOString(), msg);

  try {
    log('START');
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.getByPlaceholder('Enter email').fill(process.env.TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    await page.locator('input[type="submit"][value="Login"]').click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    log('logged in');

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.locator('.catalogueV2Repeater').first().click();
    await page.waitForTimeout(3000);
    await page.locator('button[id="addtocartbutton"]').click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();
    log('checkout page open');

    await page.locator('#to_name_field').fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
    const dateInput = page.locator('#delivery_date');
    await dateInput.fill(formatted);
    log('date filled=' + await dateInput.inputValue());

    const buttonInfo = await page.locator('button, input[type="button"], input[type="submit"], a').evaluateAll((els) => els.map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim(),
      value: el instanceof HTMLInputElement ? el.value : '',
      name: el instanceof HTMLInputElement ? el.name : '',
      id: el.id || '',
      className: el.className || '',
      html: el.outerHTML.slice(0, 200)
    })));
    console.log(JSON.stringify(buttonInfo.filter((b) => /continue|checkout|proceed|payment|confirm|delivery|order/i.test((b.text || '') + ' ' + (b.value || '') + ' ' + (b.name || '') + ' ' + b.id + ' ' + b.className)), null, 2));

    const continueBtn = page.locator('button:has-text("Continue"), input[value="Continue"], input[name="Continue"], a:has-text("Continue")').first();
    console.log('continue count=' + await continueBtn.count());
    if (await continueBtn.count()) {
      console.log('continue html=' + await continueBtn.evaluate((el) => el.outerHTML));
      await continueBtn.click({ force: true });
      log('clicked continue');
      await page.waitForTimeout(10000);
      console.log('after click url=' + page.url());
      console.log((await page.locator('body').innerText()).slice(0, 4000));
    }

    await page.screenshot({ path: 'debug-continue-action.png', fullPage: true });
  } catch (e) {
    console.error(e.stack || e.message);
    await page.screenshot({ path: 'debug-continue-action-fail.png', fullPage: true });
    throw e;
  } finally {
    await browser.close();
  }
})();
