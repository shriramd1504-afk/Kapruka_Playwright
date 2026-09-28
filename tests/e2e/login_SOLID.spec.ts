import{test, expect} from '@playwright/test';
import { LoginPage} from '../../pages/LoginPage_SOLID';


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
    test('valid user should login successfully', async({page}) =>
    {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.isLoaded();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        await loginPage.verifyLoginSuccess();

    })
});