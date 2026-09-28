import {Page, Locator} from '@playwright/test';

import { Basepage_SOLID } from './BasePage_SOLID';

export interface ProductInfo
{
  name: string;
  price: string;
}

export class ComboGiftsPage extends Basepage_SOLID
{
  readonly page: Page;
  readonly productNames: Locator;

constructor(page: Page)
{
  super(page);
  this.page = page;
  this.productNames = page.locator('.catalogueV2heading');

}

async goto()
{
  await this.page.goto('https://www.kapruka.com/online/combogifts');
  //await this.page.goto('/online/combogifts');
}

async isLoaded(): Promise<void>
{
  await this.productNames.first().waitFor({state: 'visible',timeout: 20000});
}

//getFirstProductName
async getFirstProductName(): Promise<string>
{
  const nameLocator = this.productNames.first();
  await nameLocator.waitFor({ state: 'visible', timeout: 20000});
  const name = await nameLocator.textContent(); //textContent() -> read the actual text written inside the element
  return name?.trim() ||'';

}
//card - productName - productPrice (sibling)//1000, 1-1

async getFirstProductPrice(): Promise<string>
{
  const card = this.productNames.first().locator('xpath=ancestor::div[contains(@class, "catalogueV2textBlock")]');
  const priceLocator = card.locator('.lTitlePrice').first();
  await priceLocator.waitFor({state: 'visible', timeout: 20000});
  const price = await priceLocator.textContent();
  return price?.trim() || '';
}
//listAllProducts
async listAllProducts():Promise<ProductInfo[]>
{
  //this function return a ProductInfo - an array(list) of ProductInfo Object

  await this.isLoaded();
  const count = await this.productNames.count(); //count _ how many elements currently match the locator

  const results: ProductInfo[] = [];

  for(let i = 0; i < count; i++)
  {
    const nameLocator = this.productNames.nth(i); //i=0 - grab first product, i=1 - grab second product
    const name =(await nameLocator.textContent())?.trim() || '';
    const card = nameLocator.locator('xpath=ancestor::div[contains(@class, "catalogueV2textBlock")]');
    const priceLocator = card.locator('.lTitlePrice').first();

    let price = '';

    if(await priceLocator.count()>0)
    {
      price = (await priceLocator.textContent())?.trim() || '';
    }

    results.push({name, price});
  }
  return results;
}

}
// const results = new Set<ProductInfo>();
//results.add({name,price});

