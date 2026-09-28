import {Page, Locator, expect} from '@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';
import { title } from 'node:process';

export class HomePage extends Basepage_SOLID{
    readonly kitchenAppliances: Locator;

    constructor(page: Page){
        super(page);
        this.kitchenAppliances = page.getByRole('link', {name: /Kitchen Appliances/});
        }
     async goto(): Promise<void>
     {
        await this.navigate('https://www.kapruka.com/online/electronics/price/home_appliances');
     }  
     async isLoaded(): Promise<void> {
         await expect(this.kitchenAppliances).toBeVisible();
     } 
     async hoverKitchenAppliances(): Promise<void>
     {
        await this.kitchenAppliances.hover();
     }
     async getKitchenAppliancesToolTip(): Promise<string | null>
     {
        return await this.kitchenAppliances.getAttribute('title');
     }
     async verifyKitchenAppliancesToolTip(): Promise<void>
     {
        await expect(this.kitchenAppliances).toHaveAttribute('title' , /Shop For Kitchen Appliances/);
        
     }

}