import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('Location History', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Location History...');
  
  // First hover over Reports menu to expand it
  console.log('Select Section of Location History...');
  const locationHistory = page.locator('.divTravelLogCard .select2-container').first();
  await locationHistory.click();
  await page.waitForTimeout(60000); // Wait for menu animation
  
  // Wait for and interact with the search field
  const searchInput1 = page.locator('.select2-dropdown .select2-search__field').first();
  await searchInput1.waitFor({ state: 'visible', timeout: 60000 });
  await searchInput1.fill('860111051487910');
  await page.waitForTimeout(60000); // Wait for suggestions
  await searchInput1.press('Enter');
  console.log('added device IMEI - 860111051487910');
  
  // click on startDateRange input box and paste date range -  06-23-2025 - 07-03-2025
  console.log('adding date range -> 07-14-2025 - 07-21-2025');
  const startDateRange = page.locator('.divTravelLogCard .startDateRange').first();
  await startDateRange.click();
  await startDateRange.press('Control+a');
  await startDateRange.press('Delete');
  await page.waitForTimeout(1000);
  await startDateRange.fill('');
  await page.waitForTimeout(500); // Add small delay to ensure field is cleared
  await startDateRange.type('07-14-2025 - 07-21-2025', {delay: 100}); // Type slowly to ensure accuracy
  await startDateRange.press('Enter');
  await page.waitForTimeout(1000);

  // Generate report
  await page.locator('.divTravelLogCard').getByRole('button', { name: 'Submit' }).click();


  // add wait time of 5 seconds 
  await page.waitForTimeout(30000);
  
  // Check sorting for specific columns
  console.log('Checking column sorting...');

  // Location column
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Location")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Location")').click();
  await page.waitForTimeout(2000);

  // Date Time column  
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Date Time")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Date Time")').click();
  await page.waitForTimeout(2000);
 
  // Unit column
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Event Type")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Event Type")').click();
  await page.waitForTimeout(2000);

  // Packet Type column
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Packet Type")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Packet Type")').click();
  await page.waitForTimeout(2000);

  // Battery column
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackReport #tblTrackReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);

  // // Speed column
  // await page.locator('.secTrackReport #tblTrackReport th:has-text("Speed")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('.secTrackReport #tblTrackReport th:has-text("Speed")').click();
  // await page.waitForTimeout(2000);

  

  // // Contract Status column
  // await page.locator('#divAllDeviceCurrentLocation #tblAllDeviceReport th:has-text("Contract Status")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('#divAllDeviceCurrentLocation #tblAllDeviceReport th:has-text("Contract Status")').click();
  // await page.waitForTimeout(2000);

  // // Contract# column
  // await page.locator('#divAllDeviceCurrentLocation #tblAllDeviceReport th:has-text("Contract#")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('#divAllDeviceCurrentLocation #tblAllDeviceReport th:has-text("Contract#")').click();
  // await page.waitForTimeout(2000);

  //check search box is working
  const searchInput2 = page.locator('.secTrackReport #tblTrackReport_filter input[type="search"]');
  await searchInput2.fill('07/21/2025');
  await page.waitForTimeout(1000);
  // to clear search box
  await searchInput2.press('Control+a');
  await searchInput2.press('Delete');
  await page.waitForTimeout(1000);
  
  // check page limit is working
  const pageLimit = page.locator('.secTrackReport  select[name="tblTrackReport_length"]');
  await pageLimit.selectOption('25');
  await page.waitForTimeout(3000);
  await pageLimit.selectOption('10');
  await page.waitForTimeout(3000);

  //check pagination is working
  console.log('Testing pagination...');
  const paginationButtons = page.locator('.secTrackReport #tblTrackReport_paginate li.page-item a');
  const paginationCount = await paginationButtons.count();
  
  if (paginationCount > 0) {
    console.log(`Found ${paginationCount} pagination buttons`);
    for (let i = 0; i < Math.min(paginationCount, 3); i++) { // Test first 3 pages to avoid long test
      const button = paginationButtons.nth(i);
      const isDisabled = await button.evaluate(el => el.classList.contains('disabled') || el.parentElement.classList.contains('disabled'));
      
      if (!isDisabled) {
        console.log(`Clicking pagination button ${i + 1}`);
        await button.click();
        await page.waitForTimeout(2000); // Wait for page to load
      }
    }
  } else {
    console.log('No pagination buttons found - table may have only one page');
  }

  //check export buttons "Excel", "PDF", "CSV" is working
  console.log('Testing export buttons...');
  const exportButtons = page.locator('.secTrackReport a.buttons-excel, .secTrackReport a.buttons-pdf, .secTrackReport a.buttons-csv');
  const exportCount = await exportButtons.count();
  
  if (exportCount > 0) {
    console.log(`Found ${exportCount} export buttons`);
    for (let i = 0; i < exportCount; i++) {
      const button = exportButtons.nth(i);
      const buttonText = await button.textContent();
      console.log(`Clicking export button: ${buttonText}`);
      await button.click();
      await page.waitForTimeout(2000); // Wait for export to process
    }
  } else {
    console.log('No export buttons found');
  }

  //add wait time of 10 seconds 
  await page.waitForTimeout(10000);
});