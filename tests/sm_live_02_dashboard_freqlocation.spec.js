import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('Frequent Location', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Frequent Location with better error handling
  console.log('Attempting to navigate to Frequent Location...');
  
  // First hover over Reports menu to expand it
  console.log('Select Section of Frequent Location...');
  const frequentLocation = page.locator('.divFrequentStopCard .select2-container').first();
  await frequentLocation.click();
  await page.waitForTimeout(60000); // Wait for menu animation
  
  // Wait for and interact with the search field
  const searchInput1 = page.locator('.select2-dropdown .select2-search__field').first();
  await searchInput1.waitFor({ state: 'visible', timeout: 60000 });
  await searchInput1.fill('868996064791239');
  await page.waitForTimeout(60000); // Wait for suggestions
  await searchInput1.press('Enter');
  console.log('added device IMEI - 868996064791239');

  await page.waitForTimeout(60000);

  // Generate report
  await page.locator('.divFrequentStopCard').getByRole('button', { name: 'Submit' }).click();


  // add wait time of 10 seconds 
  await page.waitForTimeout(30000);
  
  // Check sorting for specific columns
  console.log('Checking column sorting...');

  // Most Frequent Locations column
  await page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th:has-text("Most Frequent Locations")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th:has-text("Most Frequent Locations")').click();
  await page.waitForTimeout(2000);

  // # of times column  
  await page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th:has-text("# of times")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th:has-text("# of times")').click();
  await page.waitForTimeout(2000);
 
  // Most Recent
  const mostRecent = page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th')
    .filter({ hasText: /^Most Recent$/ });
  await mostRecent.first().click();
  await page.waitForTimeout(2000);
  await mostRecent.first().click();
  await page.waitForTimeout(2000);

  // 2nd Most Recent
  const secondMostRecent = page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table th')
    .filter({ hasText: /^2nd Most Recent$/ });
  await secondMostRecent.first().click();
  await page.waitForTimeout(2000);
  await secondMostRecent.first().click();
  await page.waitForTimeout(2000);

  // // 3rd Most Recent
  // const thirdMostRecent = page.locator('.secTrackFreqStop .dataTables_scrollHeadInner table  th')
  //   .filter({ hasText: /^3rd Most Recent$/ });
  // await thirdMostRecent.first().click();
  // await page.waitForTimeout(2000);
  // await thirdMostRecent.first().click();
  // await page.waitForTimeout(2000);


  // // Speed column
  // await page.locator('.secTrackFreqStop #tblTrackReport th:has-text("Speed")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('.secTrackFreqStop #tblTrackReport th:has-text("Speed")').click();
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

  // check page limit is working
  const pageLimit = page.locator('.secTrackFreqStop  select[name="tblTrackFreqStopReport_length"]');
  await pageLimit.selectOption('25');
  await page.waitForTimeout(5000);
  // Change page limit to 10 again
  await pageLimit.selectOption('10');

  //check search box is working
  const searchInput2 = page.locator('.secTrackFreqStop #tblTrackFreqStopReport_filter input[type="search"]');
  await searchInput2.fill('08/20/2025');
  await page.waitForTimeout(1000);
  // to clear search box
  await searchInput2.press('Control+a');
  await searchInput2.press('Delete');
  await page.waitForTimeout(1000);
  
  //check pagination is working
  console.log('Testing pagination...');
  const paginationButtons = page.locator('.secTrackFreqStop #tblTrackFreqStopReport_paginate li.page-item a');
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
  const exportButtons = page.locator('.secTrackFreqStop a.buttons-excel, .secTrackFreqStop a.buttons-pdf, .secTrackFreqStop a.buttons-csv');
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