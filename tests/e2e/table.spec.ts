import{test, expect} from '../../fixtures/auth/pageFixtures';
import { TablePage } from '../../pages/TablePage';

test('should navigate to tables page and validate rows', async({tablePage}) =>
{
    const rowCount = await tablePage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);

    const rowsData = await tablePage.getAllRowData();
    for(const rowData of rowsData)
    {
        await tablePage.validateRowData(rowData);
    }
})
