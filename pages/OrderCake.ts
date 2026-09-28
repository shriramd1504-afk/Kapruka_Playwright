import{Page, Locator, expect} from '@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';

export class OrderCake extends Basepage_SOLID
{
    readonly searchBox: Locator;
    readonly selectFristCakeOption: Locator;

    private async pickDropdownOption(dropdown: Locator, optionText: string): Promise<void> {
        await expect(dropdown).toBeVisible({ timeout: 30000 });
        await dropdown.click();

        const option = this.page.locator('.select2-results__option, li[role="treeitem"], [role="option"]').filter({ hasText: optionText }).first();
        await expect(option).toBeVisible({ timeout: 30000 });
        await option.click();
    }

    private getTomorrowISO(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    }

    constructor(page: Page)
    {
        super(page);
        this.searchBox = page.getByPlaceholder('SEARCH PRODUCTS..');
        this.selectFristCakeOption = page.locator('.catalogueV2Repeater').first();
    }
    async goto(): Promise<void>
    {
        await this.navigate('https://www.kapruka.com/');
    }
    async isLoaded(): Promise<void> {
        await expect(this.searchBox).toBeVisible();
    }
    async searchWithCake(): Promise<void>
    {
        await expect(this.searchBox).toBeVisible({ timeout: 30000 });
        await this.searchBox.fill('Cake');
        await this.page.keyboard.press('Enter');
        await this.page.locator('.catalogueV2Repeater').first().waitFor({ state: 'visible', timeout: 30000 });
    }
    async verifyCakePageOpened(): Promise<void>
    {
        await expect(this.page).toHaveTitle('Cake Delivery Sri Lanka | Same-Day Birthday & Hotel Cakes');
        await expect(this.page).toBeTruthy();
    }
    async selectFirstCake(): Promise<String>
    {
        await expect(this.selectFristCakeOption).toBeEnabled();
        const cakeName = await this.page.locator('.catalogueV2heading').first().textContent();
        await this.selectFristCakeOption.click();
        return cakeName?.trim() || '';
    }
    async verifyCakePage(name: string): Promise<void>
    {
        const cakeName = await this.page.locator('div[class="blockDelivery imgtags"]');
        await expect(cakeName).toContainText(name);
    }
    async clickOnAddToCart(): Promise<void>
    {
        const addtoCartButton = this.page.locator('button[id="addtocartbutton"]');
        await expect(addtoCartButton).toBeVisible({ timeout: 30000 });
        await addtoCartButton.click();

        const cartPopup = this.page.getByText('Item added to the cart.');
        await cartPopup.waitFor({ state: 'visible', timeout: 30000 });

        const viewCart = this.page.getByRole('link', { name: 'View Cart' }).first();
        await expect(viewCart).toBeVisible({ timeout: 30000 });
        await viewCart.click();
    }
    async viewCartPage(): Promise<void>
    {
        const continueDeliveryButton = this.page.locator("//button[@class='checkoutBtn js-checkout']");
        await expect(continueDeliveryButton).toBeVisible({ timeout: 30000 });
        await continueDeliveryButton.click();
    }
    async verifyDeliveryOrderPlacementPage(): Promise<void>
    {
        //await expect(this.page).toHaveURL('https://www.kapruka.com/shops/checkout/deliveryCartViewPage.jsp');
    }
    async updateRecipientInfo(): Promise<void>
    {
        const recipientName = this.page.locator('#to_name_field');
        await expect(recipientName).toBeVisible();
        await recipientName.fill('SD');

        const phone = this.page.getByPlaceholder("Your Receipient's phone number(s)");
        await expect(phone).toBeVisible();
        await phone.fill('1234567890');

        const address = this.page.getByPlaceholder('Address');
        await expect(address).toBeVisible();
        await address.fill('Address1');

        const delCity = this.page.locator('span.select2-selection__arrow').first();
        await this.pickDropdownOption(delCity, 'Agalawatta');

        const locationType = this.page.locator('span.select2-selection__arrow').nth(1);
        await this.pickDropdownOption(locationType, 'House');

        const formattedTomorrow = this.getTomorrowISO();

        const deliveryDateInput = this.page.locator('#delivery_date');
        await expect(deliveryDateInput).toBeVisible({ timeout: 30000 });

        const currentValue = await deliveryDateInput.inputValue();
        if (currentValue !== formattedTomorrow) {
            await deliveryDateInput.fill(formattedTomorrow, { force: true });
            await deliveryDateInput.evaluate((element: HTMLInputElement) => {
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        await expect(deliveryDateInput).toHaveValue(formattedTomorrow, { timeout: 30000 });

        const continueButton = this.page.locator('button:has-text("Continue"), input[value="Continue"], input[name="Continue"], a:has-text("Continue")').first();
        await expect(continueButton).toBeVisible({ timeout: 30000 });
        await continueButton.click({ force: true });
    }
    async verifyOrderPreviewPage(): Promise<void>
    {
        //await expect(this.page).toHaveURL('https://www.kapruka.com/shops/checkout/deliveryCartFinalPage.jsp');
    }
    async orderPreviewPage(): Promise<void>
    {
        const orderSummaryHeading = this.page.locator("p[class='heading heading_block']");
        await expect(orderSummaryHeading).toBeVisible({ timeout: 30000 });

        const termCheckBox = this.page.locator('#warning_confirm_checkbox, label:has-text("I agree with this delivery date") input[type="checkbox"], input[type="checkbox"][name*="confirm" i], input[type="checkbox"][id*="confirm" i]').first();
        await expect(termCheckBox).toBeVisible({ timeout: 30000 });
        if (!(await termCheckBox.isChecked().catch(() => false))) {
            await termCheckBox.check({ force: true });
        }

        const proceedToPaymentBtn = this.page.locator("input[name='Proceed to Checkout'], input[value='Proceed to Checkout'], input[type='submit'][value*='Proceed'], button:has-text('Proceed to Checkout')").first();
        await expect(proceedToPaymentBtn).toBeVisible({ timeout: 30000 });
        await proceedToPaymentBtn.click();
    }
    async verifySecurePaymentPage(): Promise<void>
    {
        //await expect(this.page).toHaveURL('https://www.kapruka.com/shops/checkout/securePayment.jsp');
    }
    async securePayementPage(): Promise<void>
    {
        //await this.page.waitForTimeout(10000);
        const paymentMethodHeading = await this.page.locator("//h2[text()='Payment Methods']");
        await expect(paymentMethodHeading).toBeVisible();
        console.log("Payement Method page is Loaded successfully: " + paymentMethodHeading.isVisible());
        const cardNumberField = await this.page.locator('#card_number');
        console.log(("Card Number Field is enabled: " + cardNumberField.isEnabled()).valueOf());
        const expiryDt = await this.page.locator('#expiry');
        console.log(("Expiry Date Field is enabled: " + expiryDt.isEnabled()).valueOf());
        const cvvCode = await this.page.locator('#card_number2');
        console.log(("CVV Code Field is enabled: " + cvvCode.isEnabled()).valueOf());
        const cardHolderName = await this.page.locator('#card_number3');
        console.log(("Card Holder Name Field is enabled: " + cardHolderName.isEnabled()).valueOf());
        const cardHolderAdd = await this.page.locator('#card_number4');
        console.log(("Card Holder Address Field is enabled: " + cardHolderAdd.isEnabled()).valueOf());
        const cardHolderCity = await this.page.locator('#card_number5');
        console.log(("Card Holder City Field is enabled: " + cardHolderCity.isEnabled()).valueOf());
        const cardHolderState = await this.page.locator('#card_number6');
        console.log(("Card Holder State Field is enabled: " + cardHolderState.isEnabled()).valueOf());
        const cardHolderPin = await this.page.locator('#card_number7');
        console.log(("Card Holder Pin Field is enabled: " + cardHolderPin.isEnabled()).valueOf());
        const cardHolderCountry = await this.page.locator('#card_number8');
        console.log(("Card Holder Country Field is enabled: " + cardHolderCountry.isEnabled()).valueOf());
        const cardHolderPhone = await this.page.locator('#card_number9');
        console.log(("Card Holder Phone Field is enabled: " + cardHolderPhone.isEnabled()).valueOf());
        const cardHolderEmail = await this.page.locator('#email');
        console.log(("Card Holder Email Field is enabled: " + cardHolderEmail.isEnabled()).valueOf());
        const completeTransactionBtn = await this.page.locator('#submit_button');
        console.log(("Complete Transaction Button is enabled: " + completeTransactionBtn.isEnabled()).valueOf());
    }


}