import { Page, Locator, expect } from '@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';
import { config } from '../config/environment';

export class LoginPage extends Basepage_SOLID
{
    readonly emailInput : Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page)
    {
        super(page);
        this.emailInput = page.locator('input[name="email"], input#exampleInputEmail1');
        this.passwordInput = page.locator('input[name="password"], input#exampleInputPassword1');
        this.loginButton = page.locator('input[type="submit"][value="Login"], button:has-text("Login"), button[type="submit"], input[name="Login"]');
    }
    async goto(): Promise<void>
    {
        await this.navigate(`${config.baseUrl}${config.loginPath}`);
    }

    async isLoaded(): Promise<void> {
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }
    async login(email:string, password:string): Promise<void>{
        await this.fill(this.emailInput, email);
        await this.fill(this.passwordInput, password);
        await this.click(this.loginButton);
    }
    async verifyLoginSuccess():Promise<void>
    {
        const currentUrl = this.page.url();
        if(currentUrl.includes('error'))
        {
            throw new Error("Login Failed");
        }
        await expect(this.page).not.toHaveURL(/accountLogin/);
    }
}