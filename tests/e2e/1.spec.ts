import{test, expect} from '@playwright/test';
import { LoginPage} from '../../pages/LoginPage_SOLID';
import { log } from 'node:console';


const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

if(!TEST_EMAIL || !TEST_PASSWORD){
    throw new Error(
        'Missing TEST_EMAIL or TEST_PASSWORD enviornment variable. ' +
        'Set these in your .env file or CI/CD secrets before running tests'
    );

}
test.describe('Login Using data Drivern Testing', () =>
{
    const cases =[
            {label: 'wrong passsword', email: TEST_EMAIL, password: 'wrong password', shouldSucceed: false},
            {label: 'wrong email', email: 'wrong email', password: 'TEST_PASSWORD', shouldSucceed: false},
            {label: 'empty fields', email: '', password: '', shouldSucceed: false},
            {label: 'valid credentials', email: TEST_EMAIL, password: 'TEST_PASSWORD', shouldSucceed: true}
        
    ];
    for(const{label, email, password, shouldSucceed} of cases)
    {
        test(`Login: ${label}`, async({page}) =>
        {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.isLoaded();
            await loginPage.login(email, password);
            console.log(shouldSucceed);
        });
    }
    
});