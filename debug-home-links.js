const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://kapruka.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  const text = await page.locator('body').innerText();
  const matches = text.split(/\s+/).filter(word => /account|login|my/i.test(word)).slice(0, 100);
  console.log('MATCHES', matches);
  console.log('HAS ACCOUNT TEXT?', /account/i.test(text));
  console.log('HAS LOGIN TEXT?', /login/i.test(text));
  console.log('BODY SAMPLE:\n' + text.slice(0, 5000));
  await browser.close();
})();
