import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('Name/Edit Trackers', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Name/Edit Trackers...');
  
  // Try multiple selectors to find and click the Geofencing menu
  console.log('Attempting to click Admin Settings menu...');
  const accountInfoMenuSelectors = [
    page.locator('a:has-text("Admin Settings")'),
    page.getByRole('link', { name: 'Admin Settings' }),
    //page.locator('#aAddEditDriver'),
    page.locator('.nav-item:has-text("Admin Settings")')
  ];

  let accountInfoMenuClicked = false;
  for (const selector of accountInfoMenuSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 60000 });
      await selector.click();
      console.log('Successfully clicked Admin Settings menu');
      accountInfoMenuClicked = true;
      await page.waitForTimeout(60000); // Wait for menu animation
      break;
    } catch (e) {
      console.log(`Admin Settings menu selector failed: ${e.message}`);
      continue;
    }
  }

  if (!accountInfoMenuClicked) {
    throw new Error('Failed to click Admin Settings menu');
  }
  
  // Then click on "Trip Report" link
  console.log('Clicking on Name/Edit Trackers...');
  const viewListedTrackersSelectors = [
    page.locator('#aAddEditDriver').first(),
    page.getByRole('link', { name: 'Name/Edit Trackers' }),
    page.locator('a:has-text("Name/Edit Trackers")'),
  ];

  let viewListedTrackersClicked = false;
  for (const selector of viewListedTrackersSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 60000 });
      await selector.click();
      console.log('Successfully clicked on Name/Edit Trackers');
      viewListedTrackersClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!viewListedTrackersClicked) {
    throw new Error('Could not find or click Name/Edit Trackers link');
  }

  // Wait for All Unit Current Status page to load
  console.log('Waiting for Name/Edit Trackers page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(60000); // Wait for menu animation
  
  // Check sorting for specific columns
  console.log('Checking column sorting...');
  
  // Unit column
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Icon")').click();
  await page.waitForTimeout(2000);
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Icon")').click();
  await page.waitForTimeout(2000);

  // Last Activity column
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Vehicle Name")').click();
  await page.waitForTimeout(2000);
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Vehicle Name")').click();
  await page.waitForTimeout(2000);

  // Location column
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("IMEI")').click();
  await page.waitForTimeout(2000);
  await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("IMEI")').click();
  await page.waitForTimeout(2000);

  // // Motion Status column
  // await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Operation")').click();
  // await page.waitForTimeout(2000);
  // await page.locator('#divViewEditDriverNew .dataTables_scrollHead .tblAddEditDriver th:has-text("Operation")').click();
  // await page.waitForTimeout(2000);
  
  const searchInput = page.locator('#divViewEditDriverNew input[type="search"]');
  await searchInput.fill('868996064572332');
  await page.waitForTimeout(2000);
  //clear the search box
  await searchInput.fill('');
  await page.waitForTimeout(2000);
  
  // check page limit is working
  const pageLimit = page.locator('#divViewEditDriverNew select[name="DataTables_Table_0_length"]');
  await pageLimit.selectOption('25');
  await page.waitForTimeout(2000);
  await pageLimit.selectOption('10');
  await page.waitForTimeout(2000);

  //check pagination is working
  console.log('Testing pagination...');
  const paginationButtons = page.locator('#divViewEditDriverNew #DataTables_Table_0_paginate li.page-item a');
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
  const exportButtons = page.locator('#divViewEditDriverNew a.buttons-excel, #divViewEditDriverNew a.buttons-pdf, #divViewEditDriverNew a.buttons-csv');
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
  
});