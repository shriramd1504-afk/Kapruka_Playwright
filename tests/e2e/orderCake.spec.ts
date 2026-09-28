import{test, expect} from '../../fixtures/auth/pageFixtures';
import { OrderCake } from '../../pages/OrderCake'
import { LoginPage } from '../../pages/LoginPage_SOLID';


const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;
if(!TEST_EMAIL || !TEST_PASSWORD){
    throw new Error(
        'Missing TEST_EMAIL or TEST_PASSWORD enviornment variable. ' +
        'Set these in your .env file or CI/CD secrets before running tests'
    );
}
test.describe('Kapruka login test', () =>
{
    
test('Order Cake FLow', async({orderCake, page}) =>
{
    const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.isLoaded();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await loginPage.verifyLoginSuccess();
    await orderCake.goto();
    await orderCake.isLoaded();
    const ordercake = new OrderCake(page);
    await ordercake.searchWithCake();
    await ordercake.verifyCakePageOpened();
    const cakeName = await ordercake.selectFirstCake();
    console.log('First Cake Name is: ' +cakeName);
    await ordercake.verifyCakePage(cakeName.toString());
    await ordercake.clickOnAddToCart();
    await ordercake.viewCartPage();
    await ordercake.verifyDeliveryOrderPlacementPage();
    await ordercake.updateRecipientInfo();
    await ordercake.verifyOrderPreviewPage();
    await ordercake.orderPreviewPage();
    await ordercake.verifySecurePaymentPage();
    await ordercake.securePayementPage();


});
});