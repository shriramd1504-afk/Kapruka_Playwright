import{Page, Locator, expect} from'@playwright/test';
import { BasePage } from './BasePage';
import { error } from 'node:console';
export class LoginPage extends BasePage {
//readonly emailInput: Locator;
readonly emailInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;
constructor(page: Page){
super(page);
 this.emailInput = page.locator('input[name="email"], input#exampleInputEmail1');
 this.passwordInput = page.locator('input[name="password"], input#exampleInputPassword1');
 this.loginButton = page.locator('input[type="submit"][value="Login"], button:has-text("Login"), button[type="submit"], input[name="Login"]');
}
async goto(): Promise<void>
{
    await this.navigate('https://www.kapruka.com/shops/customerAccounts/accountLogin.jsp');
}
async isLoaded(): Promise<void> {
    await expect(this.emailInput).toBeVisible;
    await expect(this.passwordInput).toBeVisible;
    await expect(this.loginButton).toBeVisible;
}
async login(email: string, password: string) {
await this.fill(this.emailInput, email);
//await this.emailInput.fill(email); This can also work
await this.fill(this.passwordInput, password);
await this.click(this.loginButton);
}
async verifyLoginSuccess():Promise<void>
{
    const currentUrl = this.page.url();
    if(currentUrl.includes('error'))
    {
        throw new Error('Login Failed');
    }
    await expect(this.page).not.toHaveURL(/accountLogin/);
}

}