import{test, expect} from '@playwright/test';
import { CurrencyPage } from '../../pages/CurrencyPage';

test.describe('Currnecy Dropdown check', () =>
{
    test('Switch from USD to INR', async ({page}) =>
    {
        const currencyPage = new CurrencyPage(page);

        await currencyPage.goto();
        await currencyPage.isLoaded();
        await currencyPage.selectCurrency('USD');
        await currencyPage.verifyCurrency('USD');

        await currencyPage.selectCurrency('INR');
        await currencyPage.verifyCurrency('INR');


    });

    test('Switch from INR to USD', async ({page}) =>
    {
        const currencyPage = new CurrencyPage(page);

        await currencyPage.goto();
        await currencyPage.isLoaded();
        await currencyPage.selectCurrency('INR');
        await currencyPage.verifyCurrency('INR');

        await currencyPage.selectCurrency('USD');
        await currencyPage.verifyCurrency('USD');


    })
});