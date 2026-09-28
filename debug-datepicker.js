const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  try {
    console.log('STEP 1 login page');
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('STEP 2 login fill');
    await page.getByPlaceholder('Enter email').fill(process.env.TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    await page.locator('input[type="submit"][value="Login"]').click();
    console.log('STEP 3 login clicked');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('STEP 4 logged in URL', page.url());

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    console.log('STEP 5 search done');
    await page.locator('.catalogueV2Repeater').first().click();
    console.log('STEP 6 product clicked');
    await page.waitForTimeout(3000);
    await page.locator('button[id="addtocartbutton"]').click();
    console.log('STEP 7 added to cart');
    await page.getByRole('link', { name: 'View Cart' }).click();
    console.log('STEP 8 cart view');
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();
    console.log('STEP 9 checkout page');

    await page.locator('#to_name_field').fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    console.log('STEP 10 fields filled');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();
    console.log('STEP 11 city and location selected');

    const inputs = await page.locator('input').evaluateAll((els) => els.map((el) => ({
      id: el.id,
      name: el.name,
      type: el.type,
      placeholder: el.placeholder,
      ariaLabel: el.getAttribute('aria-label'),
      value: el.value,
      className: el.className,
      readonly: el.readOnly,
      disabled: el.disabled
    })))
    console.log('INPUTS', JSON.stringify(inputs.filter((x) => /date|deliver|delivery|calendar|pickup|time/i.test(x.id + ' ' + x.name + ' ' + x.placeholder + ' ' + x.ariaLabel + ' ' + x.className)).slice(0, 50), null, 2));

    const dateInput = page.locator('input[placeholder="Delivery Date *"], input[aria-label*="Delivery Date" i], input[name*="deliveryDate" i], input[id*="deliveryDate" i], input[type="date"]').first();
    const count = await dateInput.count();
    console.log('DATE_INPUT_COUNT', count);
    if (count) {
      console.log('DATE_INPUT_HTML', await dateInput.evaluate((el) => el.outerHTML));
      console.log('DATE_INPUT_VALUE', await dateInput.inputValue());
      const label = await page.locator('label').evaluateAll((els) => els.map(el => ({ text: (el.textContent||'').trim(), html: el.outerHTML.slice(0,200) })).filter(x => /delivery date/i.test(x.text) || /date/i.test(x.text)).slice(0, 20));
      console.log('DATE_LABELS', JSON.stringify(label, null, 2));
      const cal = page.locator('.datepicker, .ui-datepicker, [class*="datepick"], [id*="datepick"], [class*="calendar"]').first();
      console.log('CAL_COUNT', await cal.count());
      if (await cal.count()) {
        console.log('CAL_HTML', await cal.evaluate((el) => el.outerHTML.slice(0, 2500)));
      }
    }

    const futureDay = new Date();
    futureDay.setDate(futureDay.getDate() + 1);
    const formatted = `${futureDay.getFullYear()}-${String(futureDay.getMonth() + 1).padStart(2, '0')}-${String(futureDay.getDate()).padStart(2, '0')}`;
    console.log('FORMATTED_TOMORROW', formatted);

    await dateInput.waitFor({ state: 'visible', timeout: 30000 });
    // Try native fill first
    await dateInput.fill(formatted);
    console.log('AFTER_FILL', await dateInput.inputValue());
    await page.screenshot({ path: 'debug-datepicker.png', fullPage: true });
  } catch (err) {
    console.error('ERROR', err.stack || err.message);
    await page.screenshot({ path: 'debug-datepicker-error.png', fullPage: true });
    throw err;
  } finally {
    await browser.close();
  }
})();
