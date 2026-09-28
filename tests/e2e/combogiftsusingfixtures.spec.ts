import { test, expect } from '../../fixtures/auth/pageFixtures';
//import { ComboGiftsPage } from '../../pages/ComboGiftsPage';

test.describe('Combo Gifts Page', () => {

    test('should get the first product name', async ({ comboGiftsPage }) => {
        const name = await comboGiftsPage.getFirstProductName();

        console.log('First product name:', name);

        expect(name).toBeTruthy();
        expect(name.length).toBeGreaterThan(0);
    });

    test('should get the first product price in USD format', async ({ comboGiftsPage }) => {
        const price = await comboGiftsPage.getFirstProductPrice();

        console.log('First product price:', price);

        expect(price).toBeTruthy();comboGiftsPage
        expect(price).toMatch(/^US\$/); // catches the ₹-vs-$ bug we found earlier
//         / ... / — marks the start and end of the regex pattern.
// ^ — means "the match must start at the very beginning of the string" (not just appear anywhere inside it).
// US — the literal characters "US".
// \$ — a literal dollar sign. The backslash is needed because $ normally has a special meaning in regex (it means "end of string"), 
// so \$ tells it "treat this as a plain dollar sign character, not the special symbol."
    });

    test('should list all products with name and price', async ({ comboGiftsPage }) => {
        const products = await comboGiftsPage.listAllProducts();

        console.log(`Found ${products.length} products:`);
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} — ${p.price}`);
        });

        //${i + 1} — takes the current index and adds 1 to it. This is purely cosmetic: arrays count from 0, but humans reading a numbered list expect it to start at 1. So the first product (index 0) gets printed as "1.", the second (index 1) as "2.", etc.
// ${p.name} — reads the name property off the current product object.
// ${p.price} — reads the price property off the current product object.
// The literal text . and — (an em dash) are just decorative separators, unrelated to any variable.

        expect(products.length).toBeGreaterThan(0);

        // Every product must have a non-empty name
        products.forEach(p => {
            expect(p.name).toBeTruthy();
        });
    });

    test('every listed product should have a valid USD price', async ({ comboGiftsPage }) => {
        const products = await comboGiftsPage.listAllProducts();

        expect(products.length).toBeGreaterThan(0);

        products.forEach(p => {
            expect(p.price).toMatch(/^US\$[\d,]+(\.\d{2})?$/);
        });
       //Regex explanation
// ^US\$ — same as before: must start with US$.
// [\d,]+ — \d means "any single digit (0-9)". The square brackets [ ] mean "match any one character from this set," and including , inside means digits OR commas are both allowed. The + after it means "one or more of these in a row." So this matches things like 121 or 1,234.
// (\.\d{2})? — \. is a literal decimal point (escaped like the dollar sign). \d{2} means "exactly 2 digits." So (\.\d{2}) as a group means "a decimal point followed by exactly two digits" (i.e., cents, like .32). The ? right after the group makes the entire group optional — the price might or might not have cents.
// $ at the very end — this time it's not escaped, so it means what it normally means: "the match must end here," i.e., nothing extra is allowed after the matched price.
        // At least one product should be present
    });

    test('the first product from listAllProducts should match getFirstProductName/Price', async ({ comboGiftsPage }) => {
        // Cross-check: two different methods reading the same first product
        // should agree with each other.
        const name = await comboGiftsPage.getFirstProductName();
        const price = await comboGiftsPage.getFirstProductPrice();

        const products = await comboGiftsPage.listAllProducts();
        const firstFromList = products[0];

        expect(firstFromList.name).toBe(name);
        expect(firstFromList.price).toBe(price);
    });

  
});