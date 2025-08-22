import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('In Aggressive', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(30000);

  // Navigate to In Aggressive with better error handling
  console.log('Attempting to navigate to In Aggressive...');

  // first we will check the count of devices are in aggressive mode
  const countOfDevicesInAggressiveMode = page.locator('.divVehicleInAggressiveMode .numbers');
  const countText = await countOfDevicesInAggressiveMode.innerText();
  const count = parseInt(countText);

  if (count > 0) {
  //await countOfDevicesInAggressiveMode.click();
  await page.waitForTimeout(12000);


  
  // First hover over Reports menu to expand it
 /*
  console.log('Hovering over Reports menu...');
  const reportsMenu = page.locator('a:has-text("Reports")');
  await reportsMenu.hover();
  await page.waitForTimeout(2000); // Wait for menu animation
 */
  // Then click on "All Unit Current Status" link
  console.log('Clicking In Aggressive...');
  const inAggressive = page.locator('.divVehicleInAggressiveMode .btnView').first();
  await inAggressive.click();
  await page.waitForTimeout(12000);

  // Wait for All Unit Current Status page to load
  console.log('Waiting for In Aggressive page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(12000); // Wait for menu animation
  
  // Check sorting for specific columns
  console.log('Checking column sorting...');
  
  // Unit column
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Unit")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Unit")').click();
  await page.waitForTimeout(2000);

  // Last Activity column
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Last Activity")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Last Activity")').click();
  await page.waitForTimeout(2000);

  // Location column
  const mostRecent = page.locator('#tblDeviceInAggReport th')
   .filter({ hasText: /^Location$/ });
  await mostRecent.first().click();
  await page.waitForTimeout(2000);
  await mostRecent.first().click();
  await page.waitForTimeout(2000);

  // Details column
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);
  await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Battery")').click();
  await page.waitForTimeout(2000);

  // // Motion Status column
  // await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Location")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('.secInAggDevice #tblDeviceInAggReport th:has-text("Location")').click();
  // await page.waitForTimeout(2000);
  
  // check page limit is working
  const pageLimit = page.locator('.secInAggDevice select[name="tblDeviceInAggReport_length"]');
  await pageLimit.selectOption('25');
  await page.waitForTimeout(2000);
  await pageLimit.selectOption('10');
  await page.waitForTimeout(2000);

  //check search box is working
  const searchInput = page.locator('.secInAggDevice #tblDeviceInAggReport_filter input[type="search"]');
  await searchInput.fill('861492065034917');
  await page.waitForTimeout(1000);
  await searchInput.fill('');
  await page.waitForTimeout(1000);

  //check pagination is working
  console.log('Testing pagination...');
  const paginationButtons = page.locator('.secInAggDevice #tblDeviceInAggReport_paginate li.page-item a');
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
  const exportButtons = page.locator('.secInAggDevice a.buttons-excel, .secInAggDevice a.buttons-pdf, .secInAggDevice a.buttons-csv');
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
  await page.waitForTimeout(10000);//check pagination is working
  }
  else {
    console.log('No devices are in aggressive mode');
  }
});