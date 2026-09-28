const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  try {
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.getByPlaceholder('Enter email').fill(process.env.TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    await page.locator('input[type="submit"][value="Login"]').click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.locator('.catalogueV2Repeater').first().click();
    await page.waitForTimeout(3000);
    await page.locator('button[id="addtocartbutton"]').click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();

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
    const dateInput = page.locator('#delivery_date');
    await dateInput.fill(formatted);
    console.log('DATE_VALUE=' + await dateInput.inputValue());

    const buttons = await page.locator('button, input[type="button"], input[type="submit"], a').evaluateAll((els) => els.map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim(),
      value: el instanceof HTMLInputElement ? el.value : '',
      name: el instanceof HTMLInputElement ? el.name : '',
      id: el.id || '',
      classes: el.className || '',
      html: el.outerHTML.slice(0, 220)
    })));
    console.log('BUTTONS=' + JSON.stringify(buttons.filter((b) => /continue|checkout|proceed|payment|agree|delivery/i.test((b.text || '') + ' ' + b.value + ' ' + b.name + ' ' + b.id + ' ' + b.classes)).slice(0, 80), null, 2));

    const continueBtn = page.locator('button:has-text("Continue"), input[value="Continue"], input[name="Continue"], a:has-text("Continue")').first();
    console.log('CONTINUE_COUNT=' + await continueBtn.count());
    if (await continueBtn.count()) {
      console.log('CONTINUE_HTML=' + await continueBtn.evaluate((el) => el.outerHTML).catch(() => 'n/a'));
      await continueBtn.click();
      console.log('AFTER_CLICK_URL=' + page.url());
      await page.waitForTimeout(10000);
      console.log('BODY_TEXT=' + (await page.locator('body').innerText()).slice(0, 4000));
    }

    await page.screenshot({ path: 'debug-continue-flow.png', fullPage: true });
    console.log('SUCCESS');
  } catch (err) {
    console.error(err.stack || err.message);
    await page.screenshot({ path: 'debug-continue-flow-failure.png', fullPage: true });
    throw err;
  } finally {
    await browser.close();
  }
})();
