const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://kapruka.com/shops/customerAccounts/accountLogin.jsp', { waitUntil: 'domcontentloaded', timeout: 30000 });

  console.log('TITLE=' + await page.title());
  console.log('INPUT COUNT=' + await page.locator('input').count());
  console.log('BUTTON COUNT=' + await page.locator('button').count());

  const inputs = await page.locator('input').evaluateAll((els) => els.map((el) => ({
    type: el.type,
    name: el.name,
    id: el.id,
    placeholder: el.placeholder,
    value: el.value,
    ariaLabel: el.getAttribute('aria-label')
  })));
  console.log('INPUTS=' + JSON.stringify(inputs.slice(0, 20), null, 2));

  const btns = await page.locator('button').evaluateAll((els) => els.map((el) => ({
    text: (el.textContent || '').trim(),
    name: el.name,
    type: el.type,
    id: el.id,
    ariaLabel: el.getAttribute('aria-label')
  })));
  console.log('BUTTONS=' + JSON.stringify(btns.slice(0, 20), null, 2));

  await browser.close();
})();
