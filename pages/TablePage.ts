import{Page, Locator, expect} from '@playwright/test';
import { Basepage_SOLID } from './BasePage_SOLID';

export interface TableRowData
{
    lastName: string;
    email: string;
}

export class TablePage extends Basepage_SOLID
{
    readonly table: Locator;
    constructor(page: Page)
    {
        super(page);
        this.table = page.locator('#table1');
    }
    async goto(): Promise<void>
    {
        await this.navigate('https://the-internet.herokuapp.com/tables');
    }
    async isLoaded(): Promise<void> {
       await this.table.waitFor({state: 'visible'});
   }
    getRows(): Locator
    {
        return this.table.locator('tbody tr');
    }
    async getRowCount(): Promise<number>
    {
        const rows = this.getRows();
        return await rows.count();
    }
    async getRowData(rowIndex: number): Promise<TableRowData>
    {
        const row = this.getRows().nth(rowIndex);
        const cell = row.locator('td');
        const lastName = await cell.nth(0).textContent();
        const email = await cell.nth(2).textContent();

        return{
            lastName: lastName?.trim() || '' ,
            email: email?.trim() || '',

        };

    }

    async getAllRowData(): Promise<TableRowData[]>
    {
        const rowCount = await this.getRowCount();
        const rowsData: TableRowData[] = [];
        
        for(let i =0; i<rowCount; i++)
        {
            const data = await this.getRowData(i);
            rowsData.push(data);
            console.log(data);
        }
        return rowsData;
    }

    async validateRowData(rowData: TableRowData): Promise<void>
    {
        expect(rowData.lastName).toBeTruthy();
        expect(rowData.email).toMatch(/@/);
        console.log(rowData.lastName);
        console.log(rowData.email);
    }
}