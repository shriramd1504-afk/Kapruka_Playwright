import {Page, Locator, expect} from '@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';

export class CurrencyPage extends Basepage_SOLID
{
    readonly currencyDropDown: Locator;

    constructor(page: Page){
        super(page);
        this.currencyDropDown = page.getByRole('combobox', {name: 'Select Currency'});
        //this.currencyDropDown = page.locator("select[aria-label='Select Currency']");
    }

    async goto():Promise<void>
    {
        await this.navigate('/');  //here URL will be prestn in .env.qa file and this called in playwright.config.ts that's why here no need to call again

    }
    async isLoaded(): Promise<void> {
        await expect(this.currencyDropDown.waitFor({state: 'visible'}));
    }
    async selectCurrency(currency: 'INR' | 'USD'): Promise<void>
    {
        await expect(this.currencyDropDown.waitFor({state: 'visible'}));
        await this.currencyDropDown.click();
        await this.currencyDropDown.selectOption({label: currency});
        await this.page.waitForLoadState('load');
    }
    async verifyCurrency(expected: string): Promise<void>
    {
        await expect(this.currencyDropDown).toHaveValue(expected);
    }
}