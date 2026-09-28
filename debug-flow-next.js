const { chromium } = require('@playwright/test');
const dotenv = require('dotenv');
dotenv.config({ path: 'config/.env.qa' });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  const log = (m) => console.log(new Date().toISOString(), m);
  try {
    log('login page');
    await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.getByPlaceholder('Enter email').fill(process.env.TEST_EMAIL);
    await page.getByPlaceholder('Password').fill(process.env.TEST_PASSWORD);
    await page.locator('input[type="submit"][value="Login"]').click();
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    log('after login ' + page.url());

    await page.getByPlaceholder('SEARCH PRODUCTS..').fill('Cake');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle', { timeout: 30000 });
    await page.locator('.catalogueV2Repeater').first().click();
    log('product selected');
    await page.waitForTimeout(2000);
    await page.locator('button[id="addtocartbutton"]').click();
    log('added cart');
    await page.getByRole('link', { name: 'View Cart' }).click();
    log('view cart');
    await page.locator("//button[@class='checkoutBtn js-checkout']").click();
    log('checkout started');

    await page.locator('#to_name_field').fill('SD');
    await page.getByPlaceholder("Your Receipient's phone number(s)").fill('1234567890');
    await page.getByPlaceholder('Address').fill('Address1');
    await page.locator('span[class="select2-selection__arrow"]').first().click();
    await page.getByRole('treeitem', { name: 'Agalawatta' }).click();
    await page.locator('span[class="select2-selection__arrow"]').nth(1).click();
    await page.getByRole('treeitem', { name: 'House' }).click();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedTomorrow = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`;
    const dateInput = page.locator('#delivery_date');
    await dateInput.fill(formattedTomorrow);
    log('date set ' + await dateInput.inputValue());

    const allButtons = await page.locator('button, input[type="button"], input[type="submit"], a').evaluateAll((els) => els.map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim(),
      value: el instanceof HTMLInputElement ? el.value : '',
      name: el instanceof HTMLInputElement ? el.name : '',
      id: el.id || '',
      className: el.className || '',
      outer: el.outerHTML.slice(0, 180)
    }))).catch(() => []);
    console.log('ALL CTAs=', JSON.stringify(allButtons.slice(0, 60), null, 2));

    const continueBtns = page.locator('button:has-text("Continue"), input[value="Continue"], input[name="Continue"], a:has-text("Continue")').first();
    const cCount = await continueBtns.count();
    log('continue count=' + cCount);
    if (cCount) {
      console.log('continue html=' + await continueBtns.evaluate(el => el.outerHTML).catch(() => 'n/a'));
      await continueBtns.click();
      log('clicked continue');
      await page.waitForTimeout(5000);
      log('after continue url=' + page.url());
      console.log('BODY HEAD=' + (await page.locator('body').innerText()).slice(0, 4000));
    }
  } catch (err) {
    console.error('ERROR', err.message);
    if (page) {
      await page.screenshot({ path: 'debug-next-step-failure.png', fullPage: true });
    }
    throw err;
  } finally {
    await browser.close();
  }
})();
