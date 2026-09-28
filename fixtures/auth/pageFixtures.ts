import { test as base } from '@playwright/test';
//import { LoginPage } from './pages/LoginPage';
//type Fixtures = { loginPage: LoginPage };
//export const test = base.extend<Fixtures>({
//loginPage: async ({ page }, use) => {
//await use(new LoginPage(page));
//},
//});
//export { expect } from '@playwright/test';
import { CurrencyPage } from '../../pages/CurrencyPage';
import {ComboGiftsPage} from '../../pages/ComboGiftsPage';
import { TablePage } from '../../pages/TablePage';
import { OrderCake } from '../../pages/OrderCake';


type PageFixtures = {
    currencyPage: CurrencyPage;
    comboGiftsPage: ComboGiftsPage;
    tablePage: TablePage;
    orderCake: OrderCake;

};

export const test = base.extend<PageFixtures>({
    //1- Setup  anything before prerequisites
    currencyPage: async({page}, use) => {
     const currencyPage = new CurrencyPage(page);
     await currencyPage.goto();
     await currencyPage.isLoaded();

     //2 - Hand OFF - use() gived control to the test
     await use(currencyPage);
     
     //3 - TEARDOWN (after your testbody)
     //currently nothing to be added
     //delete a test account after test completes, delete 

    },

    comboGiftsPage: async({page}, use) =>
    {
        const comboPage = new ComboGiftsPage(page);
        await comboPage.goto();
        await use(comboPage);
    },

    tablePage: async({page}, use) =>
    {
        const tablePage =  new TablePage(page);
        await tablePage.goto();
        await tablePage.isLoaded();
        await use(tablePage);
    },
    orderCake: async({page}, use) =>
    {
        const orderCake =  new OrderCake(page);
        await orderCake.goto();
        await orderCake.isLoaded();
        await use(orderCake);
    },
});
export{expect} from '@playwright/test';