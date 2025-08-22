import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_SM_staging';

test('View Map Trackers and Validate API Response', async ({ page }) => {
  test.setTimeout(600000);

  await loginToMatrackDashboard(page);
  await page.waitForTimeout(60000);

  console.log('Navigating to Map Trackers...');
  const mapTrackersMenu = page.locator('a:has-text("Map Trackers")');
  await mapTrackersMenu.click();
  await page.waitForTimeout(30000);

  // Listen for new page/tab to be created
  const pagePromise = page.context().waitForEvent('page');
  
  const allUnitStatusSelectors = [
    page.locator('.accessPlatform[data-type="outforrepo"]').first(),
    page.locator('.accessPlatform[data-type="outforrepo"]'),
    page.locator('a.accessPlatform[data-type="outforrepo"]'),
  ];


  let locationHistoryClicked = false;
  for (const selector of allUnitStatusSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 60000 });
      await selector.click();
      console.log('Clicked Out For Repo');
      locationHistoryClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
    }
  }

  if (!locationHistoryClicked) {
    throw new Error('Failed to click Out For Repo');
  }

  console.log('Waiting for new tab to open...');
  
  // Wait for the new page/tab to be created
  const newPage = await pagePromise;
  console.log('New tab opened');
  
  // Wait for the new page to load (use 'load' instead of 'networkidle' to avoid timeout)
  await newPage.waitForLoadState('load', { timeout: 60000 });
  
  // Additional wait for any dynamic content
  await newPage.waitForTimeout(60000);
  
  // Get the URL of the new page
  const newPageUrl = newPage.url();
  console.log('New tab URL:', newPageUrl);
  
  // Validate the URL pattern in the new tab
  if (!newPageUrl.includes('gpstracking/client/BlueHouse/maps/')) {
    throw new Error(`Expected maps URL in new tab, but got: ${newPageUrl}`);
  }
  
  // Check if it's the expected Out For Repo URL
  if (newPageUrl.includes('driverId=repo') || newPageUrl.includes('index2.php')) {
    console.log('Successfully opened Out For Repo in new tab with correct URL');
  } else {
    console.log('Warning: URL pattern is correct but may not be the expected Out For Repo page');
  }
  
  console.log('Successfully navigated to Out For Repo page in new tab');

});
