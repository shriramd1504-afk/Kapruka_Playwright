import{Page,Locator, expect} from'@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';

export class ScrollPage extends Basepage_SOLID
{
    readonly bestSellingGift: Locator;

    constructor(page: Page){
        super(page);
        this.bestSellingGift = page.getByText('Popular Searches Today:');
    }
    async goto(): Promise<void>
    {
        await this.navigate('/shops/events_home.jsp');

    }
    async isLoaded(): Promise<void> {
        await expect(this.bestSellingGift).toBeVisible();
    }

    async scrollToBestSellingGift(): Promise<void>
    {
        await this.scrollToElement(this.bestSellingGift);
        //await this.scrollDirectlyToElement(this.bestSellingGift);
    }
}