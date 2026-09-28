import{test, expect} from '@playwright/test';
import { ScrollPage } from '../../pages/ScrollPage';

test.describe('Kapruka Scroll Event Screen', () =>
{
    test('Scroll to popular search', async({page}) =>
    {
        const scrollPage = new ScrollPage(page);
        await scrollPage.goto();
        await scrollPage.scrollToBestSellingGift();
        await page.screenshot({path: 'dist/afterscroll.png'});
        await page.screenshot({path: 'dist/02-fullpage.png', fullPage:true});
    });
});