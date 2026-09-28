// import { test, expect } from '../../fixtures';
// import { config } from '../../config/env.config';
// import { users } from '../../test-data/userData';
// test('user can log in with valid credentials', async ({ page, loginPage }) => {
// await loginPage.goto(config.baseUrl);
// await loginPage.login(users.standard.email, users.standard.password);
// await expect(page).toHaveURL(/dashboard/);
// });
import{test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Kapruka Login Test', () =>
    test('Valid user should login successfully', async({page}) =>
    {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(process.env.TEST_EMAIL || 'shriramd1504@gmail.com', process.env.TEST_PASSWORD || 'Kapruka@123');
        await loginPage.verifyLoginSuccess();
    }
    )
)