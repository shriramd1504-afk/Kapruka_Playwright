import{test, expect} from '../../fixtures/auth/pageFixtures';

test.describe('Kapruka Currency Dropdown', () =>{
    test('Switch from USD to INR', async({currencyPage}) =>{
        await currencyPage.selectCurrency('USD');
        await currencyPage.verifyCurrency('USD');

        await currencyPage.selectCurrency('INR');
        await currencyPage.verifyCurrency('INR');

    })
})

