import{test, expect} from'@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Kapruka Electronics Page', () =>
{
    test('Verify kitchen Appliances toolip hover', async({page}) =>
    {
        const homepage = new HomePage(page);
        await homepage.goto();
        await homepage.isLoaded();
        await homepage.hoverKitchenAppliances();
        await homepage.verifyKitchenAppliancesToolTip();
        const tooltip = await homepage.getKitchenAppliancesToolTip();
        console.log('Tool Tip is: ' +tooltip);
        await homepage.verifyKitchenAppliancesToolTip();
        

    });
});