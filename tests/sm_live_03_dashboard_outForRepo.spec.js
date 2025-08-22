import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('Out For Repo', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Out For Repo with better error handling
  console.log('Attempting to navigate to Out For Repo...');
  
  // First hover over Reports menu to expand it
 /*
  console.log('Hovering over Reports menu...');
  const reportsMenu = page.locator('a:has-text("Reports")');
  await reportsMenu.hover();
  await page.waitForTimeout(2000); // Wait for menu animation
 */
  // Then click on "All Unit Current Status" link
  console.log('Clicking Out For Repo...');
  const outForRepo = page.locator('.divVehiclesOutForRepoCard .btnView').first();
  await outForRepo.click();
  await page.waitForTimeout(60000);

  // Wait for All Unit Current Status page to load
  console.log('Waiting for Out For Repo page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(60000); // Wait for menu animation
  
  // Check sorting for specific columns
  console.log('Checking column sorting...');
  
  // Unit column
  await page.locator('.secOutForRepoOrInAgg .dataTables_scrollHead table th:has-text("Unit")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secOutForRepoOrInAgg .dataTables_scrollHead table th:has-text("Unit")').click();
  await page.waitForTimeout(2000);

  // Last Activity column
  await page.locator('.secOutForRepoOrInAgg .dataTables_scrollHead table th:has-text("Last Activity")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secOutForRepoOrInAgg .dataTables_scrollHead table th:has-text("Last Activity")').click();
  await page.waitForTimeout(2000);
  
  // Location column
  const mostRecent = page.locator('.secOutForRepoOrInAgg .dataTables_scrollHead table th')
  .filter({ hasText: /^Location$/ });
  await mostRecent.first().click();
  await page.waitForTimeout(2000);
  await mostRecent.first().click();
  await page.waitForTimeout(2000);

  // // Motion Status column
  // await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Location")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Location")').click();
  // await page.waitForTimeout(2000);

  /*
  // Battery column  
  await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);

  // Total Trackers column  
  await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Total Trackers")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport th:has-text("Total Trackers")').click();
  await page.waitForTimeout(2000);

  */
  //check search box is working
  const searchInput = page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport_filter input[type="search"]');
  await searchInput.fill('861492066545937');
  await page.waitForTimeout(1000);
  await searchInput.fill('');
  await page.waitForTimeout(1000);
  
  // check page limit is working
  const pageLimit = page.locator('.secOutForRepoOrInAgg select[name="tblDeviceRepoOrInAggReport_length"]');
  await pageLimit.selectOption('25');
  await page.waitForTimeout(2000);
  await pageLimit.selectOption('10');
  await page.waitForTimeout(2000);

  //check pagination is working
  console.log('Testing pagination...');
  const paginationButtons = page.locator('.secOutForRepoOrInAgg #tblDeviceRepoOrInAggReport_paginate li.page-item a');
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
  const exportButtons = page.locator('.secOutForRepoOrInAgg a.buttons-excel, .secOutForRepoOrInAgg a.buttons-csv, .secOutForRepoOrInAgg a.buttons-pdf');
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